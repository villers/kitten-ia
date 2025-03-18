import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BattleStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBattleDto } from '@/battles/dto/create-battle.dto';
import { BattleEngineService } from '@/battles/services/battle-engine.service';
import { BattleState, convertKittenToBattleKitten } from '@/battles/models/battle-state.model';

@Injectable()
export class BattlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly battleEngineService: BattleEngineService,
  ) {}

  async create(createBattleDto: CreateBattleDto, challengerId: string, userId: string) {
    // Vérifier si le chaton challenger appartient à l'utilisateur
    const challenger = await this.prisma.kitten.findUnique({
      where: { id: challengerId },
      include: { abilities: true },
    });

    if (!challenger) {
      throw new NotFoundException(`Challenger kitten with ID ${challengerId} not found`);
    }

    if (challenger.userId !== userId) {
      throw new ForbiddenException('You can only battle with your own kittens');
    }

    // Vérifier si le chaton adversaire existe
    const opponent = await this.prisma.kitten.findUnique({
      where: { id: createBattleDto.opponentId },
      include: { abilities: true },
    });

    if (!opponent) {
      throw new NotFoundException(`Opponent kitten with ID ${createBattleDto.opponentId} not found`);
    }

    // Un chaton ne peut pas se battre contre lui-même
    if (challenger.id === opponent.id) {
      throw new ForbiddenException('A kitten cannot battle against itself');
    }

    // Générer un seed pour la bataille (pour la reproductibilité)
    const seed = Math.floor(Math.random() * 1000000);

    // Créer l'état initial de la bataille
    const battleState: BattleState = {
      id: '',
      round: 0,
      seed,
      challenger: convertKittenToBattleKitten(challenger),
      opponent: convertKittenToBattleKitten(opponent),
      logs: [],
      isFinished: false,
      experienceGain: 0,
    };

    // Simuler la bataille
    const completedBattleState = await this.battleEngineService.simulateBattle(battleState);

    // Enregistrer la bataille dans la base de données
    // Filtrer les logs pour ne conserver que ceux avec des capacités valides
    const validBattleMoves = completedBattleState.logs.filter(
      log => log.abilityId && log.abilityId !== ''
    ).map(log => ({
      round: log.round,
      kittenId: log.attackerId,
      abilityId: log.abilityId || '00000000-0000-0000-0000-000000000000', // ID de la capacité par défaut
      damage: log.damage,
      isSuccess: log.isSuccess,
      isCritical: log.isCritical,
    }));

    const battleLog = await this.prisma.battleLog.create({
      data: {
        challengerId: challenger.id,
        opponentId: opponent.id,
        winnerId: completedBattleState.winnerId,
        seed,
        status: BattleStatus.COMPLETED,
        replayData: completedBattleState as any,
        totalRounds: completedBattleState.round,
        currentRound: completedBattleState.round,
        experienceGain: completedBattleState.experienceGain,
        // Ne créer des battleMoves que s'il y en a de valides
        ...(validBattleMoves.length > 0 ? {
          battleMoves: {
            create: validBattleMoves,
          },
        } : {}),
      },
    });

    // Mettre à jour les statistiques du vainqueur et du perdant
    if (completedBattleState.winnerId) {
      await this.updateKittenStats(completedBattleState);
    }

    return this.findOne(battleLog.id);
  }

  async findAll(userId?: string) {
    if (userId) {
      // Récupérer tous les combats où l'utilisateur est impliqué
      return this.prisma.battleLog.findMany({
        where: {
          OR: [
            {
              challenger: {
                userId,
              },
            },
            {
              opponent: {
                userId,
              },
            },
          ],
        },
        include: {
          challenger: true,
          opponent: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Récupérer tous les combats
    return this.prisma.battleLog.findMany({
      include: {
        challenger: true,
        opponent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const battleLog = await this.prisma.battleLog.findUnique({
      where: { id },
      include: {
        challenger: true,
        opponent: true,
        battleMoves: {
          orderBy: {
            round: 'asc',
          },
        },
      },
    });

    if (!battleLog) {
      throw new NotFoundException(`Battle log with ID ${id} not found`);
    }

    return battleLog;
  }

  private async updateKittenStats(battleState: BattleState) {
    const winnerId = battleState.winnerId as string;
    const loserId = 
      winnerId === battleState.challenger.id
        ? battleState.opponent.id
        : battleState.challenger.id;

    // Mettre à jour les statistiques du vainqueur (create if not exists)
    await this.prisma.kittenStats.upsert({
      where: { kittenId: winnerId },
      update: {
        wins: { increment: 1 },
      },
      create: {
        kittenId: winnerId,
        wins: 1,
        losses: 0,
        draws: 0,
      },
    });

    // Mettre à jour les statistiques du perdant (create if not exists)
    await this.prisma.kittenStats.upsert({
      where: { kittenId: loserId },
      update: {
        losses: { increment: 1 },
      },
      create: {
        kittenId: loserId,
        wins: 0,
        losses: 1,
        draws: 0,
      },
    });

    // Donner de l'expérience au vainqueur
    const winner = await this.prisma.kitten.findUnique({
      where: { id: winnerId },
    });

    if (winner) {
      const newExperience = winner.experience + battleState.experienceGain;
      const experienceNeededForNextLevel = this.getExperienceForNextLevel(winner.level);
      
      // Vérifier si le chaton gagne un niveau
      if (newExperience >= experienceNeededForNextLevel) {
        await this.prisma.kitten.update({
          where: { id: winnerId },
          data: {
            level: { increment: 1 },
            experience: newExperience - experienceNeededForNextLevel,
            skillPoints: { increment: 5 }, // 5 points de compétence par niveau
          },
        });
      } else {
        await this.prisma.kitten.update({
          where: { id: winnerId },
          data: {
            experience: newExperience,
          },
        });
      }
    }
  }

  private getExperienceForNextLevel(currentLevel: number): number {
    // Formule simple: 100 * niveau actuel
    return 100 * currentLevel;
  }
}
