import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { KittenRepository } from '@/battles/application/kitten.repository';
import { BattleKitten, BattleAbility } from '@/battles/domain/battle-kitten';
import { BattleStatus } from '@prisma/client';

@Injectable()
export class PrismaKittenRepository implements KittenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<BattleKitten | null> {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id },
      include: { abilities: true },
    });

    if (!kitten) {
      return null;
    }

    // Mapper l'entité de la base de données vers l'objet de domaine
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

  async updateExperience(kittenId: string, experienceGain: number): Promise<void> {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id: kittenId },
    });

    if (!kitten) {
      return;
    }

    const newExperience = kitten.experience + experienceGain;
    const experienceNeededForNextLevel = this.getExperienceForNextLevel(kitten.level);

    // Vérifier si le chaton gagne un niveau
    if (newExperience >= experienceNeededForNextLevel) {
      await this.prisma.kitten.update({
        where: { id: kittenId },
        data: {
          level: { increment: 1 },
          experience: newExperience - experienceNeededForNextLevel,
          skillPoints: { increment: 5 }, // 5 points de compétence par niveau
        },
      });
    } else {
      await this.prisma.kitten.update({
        where: { id: kittenId },
        data: {
          experience: newExperience,
        },
      });
    }
  }

  async updateStats(winnerId: string, loserId: string): Promise<void> {
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
  }

  async isOwner(kittenId: string, userId: string): Promise<boolean> {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id: kittenId },
      select: { userId: true },
    });

    return kitten?.userId === userId;
  }

  private getExperienceForNextLevel(currentLevel: number): number {
    // Formule simple: 100 * niveau actuel
    return 100 * currentLevel;
  }
}