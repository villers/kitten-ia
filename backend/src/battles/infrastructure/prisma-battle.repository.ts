import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BattleRepository } from '@/battles/application/battle.repository';
import { Battle } from '@/battles/domain/battle';
import { BattleAbility, BattleKitten } from '@/battles/domain/battle-kitten';
import { BattleLogEntry } from '@/battles/domain/battle-log-entry';
import { Ability, BattleLog, BattleMove, Kitten } from '@prisma/client';

@Injectable()
export class PrismaBattleRepository implements BattleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(battle: Battle): Promise<Battle> {
    // Filtrer les logs pour ne conserver que ceux avec des capacités valides pour BattleMove
    const validBattleMoves = battle.logs
      .filter(log => log.abilityId && log.abilityId !== '')
      .map(log => ({
        round: log.round,
        kittenId: log.attackerId,
        abilityId: log.abilityId || '00000000-0000-0000-0000-000000000000', // ID de la capacité par défaut
        damage: log.damage,
        isSuccess: log.isSuccess,
        isCritical: log.isCritical,
      }));

    // Créer l'entrée dans la base de données
    const battleLog = await this.prisma.battleLog.create({
      data: {
        id: battle.id,
        challengerId: battle.challenger.id,
        opponentId: battle.opponent.id,
        winnerId: battle.winnerId,
        seed: battle.seed,
        status: 'COMPLETED',
        replayData: battle.toJSON() as any,
        totalRounds: battle.round,
        currentRound: battle.round,
        experienceGain: battle.experienceGain,
        // Ne créer des battleMoves que s'il y en a de valides
        ...(validBattleMoves.length > 0
          ? {
              battleMoves: {
                create: validBattleMoves,
              },
            }
          : {}),
      },
    });

    return this.findById(battleLog.id) as Promise<Battle>;
  }

  async findById(id: string): Promise<Battle | null> {
    const battleLog = await this.prisma.battleLog.findUnique({
      where: { id },
      include: {
        challenger: {
          include: {
            abilities: true,
          },
        },
        opponent: {
          include: {
            abilities: true,
          },
        },
        battleMoves: {
          orderBy: {
            round: 'asc',
          },
          include: {
            ability: true,
          },
        },
      },
    });

    if (!battleLog) {
      return null;
    }

    return this.mapToDomain(battleLog);
  }

  async findAll(): Promise<Battle[]> {
    const battleLogs = await this.prisma.battleLog.findMany({
      include: {
        challenger: {
          include: {
            abilities: true,
          },
        },
        opponent: {
          include: {
            abilities: true,
          },
        },
        battleMoves: {
          orderBy: {
            round: 'asc',
          },
          include: {
            ability: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Promise.all(battleLogs.map(battleLog => this.mapToDomain(battleLog)));
  }

  async findByUserId(userId: string): Promise<Battle[]> {
    const battleLogs = await this.prisma.battleLog.findMany({
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
        challenger: {
          include: {
            abilities: true,
          },
        },
        opponent: {
          include: {
            abilities: true,
          },
        },
        battleMoves: {
          orderBy: {
            round: 'asc',
          },
          include: {
            ability: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Promise.all(battleLogs.map(battleLog => this.mapToDomain(battleLog)));
  }

  async update(battle: Battle): Promise<Battle> {
    // Pour l'instant, on ne prend pas en charge la mise à jour des batailles
    return battle;
  }

  // Méthode privée pour mapper les entités de la base de données vers des objets de domaine
  private async mapToDomain(
    battleLog: BattleLog & {
      challenger: Kitten & { abilities: Ability[] };
      opponent: Kitten & { abilities: Ability[] };
      battleMoves: (BattleMove & { ability: Ability })[];
    },
  ): Promise<Battle> {
    // Convertir les chatons
    const challenger = this.mapKittenToBattleKitten(battleLog.challenger);
    const opponent = this.mapKittenToBattleKitten(battleLog.opponent);

    // Si les logs sont stockés dans replayData, utiliser ces logs
    if (battleLog.replayData && typeof battleLog.replayData === 'object' && 'logs' in battleLog.replayData) {
      const replayData = battleLog.replayData as any;
      // Reconstruire les logs à partir des données de replay
      const logs = replayData.logs.map((log: any) =>
        BattleLogEntry.create(
          log.round,
          log.turn,
          log.attackerId,
          log.defenderId,
          log.abilityId,
          log.abilityName,
          log.damage,
          log.isSuccess,
          log.isCritical,
          log.message,
          log.attackerHealth,
          log.defenderHealth,
        ),
      );

      return Battle.create(
        battleLog.id,
        battleLog.seed,
        challenger,
        opponent
      )
      .withRound(battleLog.totalRounds)
      .finish(battleLog.winnerId || undefined)
      .withExperienceGain(battleLog.experienceGain);
    }

    // Sinon, reconstruire les logs à partir des battleMoves
    const logs = battleLog.battleMoves.map(move => {
      const attacker = move.kittenId === battleLog.challengerId ? challenger : opponent;
      const defender = move.kittenId === battleLog.challengerId ? opponent : challenger;

      return BattleLogEntry.create(
        move.round,
        0, // Pas d'information sur le tour
        move.kittenId,
        move.kittenId === battleLog.challengerId ? battleLog.opponentId : battleLog.challengerId,
        move.abilityId,
        move.ability.name,
        move.damage,
        move.isSuccess,
        move.isCritical,
        `${attacker.name} uses ${move.ability.name} and deals ${move.damage} damage${
          move.isCritical ? ' (Critical)' : ''
        }!`,
        0, // Pas d'information sur la santé
        0, // Pas d'information sur la santé
      );
    });

    const battle = Battle.create(
      battleLog.id,
      battleLog.seed,
      challenger,
      opponent
    );

    // Ajouter les logs
    let battleWithLogs = battle;
    for (const log of logs) {
      battleWithLogs = battleWithLogs.addLog(log);
    }

    return battleWithLogs
      .withRound(battleLog.totalRounds)
      .finish(battleLog.winnerId || undefined)
      .withExperienceGain(battleLog.experienceGain);
  }

  private mapKittenToBattleKitten(kitten: Kitten & { abilities: Ability[] }): BattleKitten {
    const battleAbilities = kitten.abilities.map(ability =>
      BattleAbility.create(
        ability.id,
        ability.name,
        ability.description,
        ability.type.toString(),
        ability.power,
        ability.accuracy,
        ability.cooldown,
      ),
    );

    return BattleKitten.create(
      kitten.id,
      kitten.name,
      kitten.level,
      kitten.strength,
      kitten.agility,
      kitten.constitution,
      kitten.intelligence,
      undefined, // Recalculer la santé max
      undefined, // Initialiser la santé actuelle à santé max
      battleAbilities,
    );
  }
}