import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { KittenRepository } from '../../domain/repositories/kitten-repository.interface';
import { KittenEntity } from '../../domain/entities/kitten.entity';

@Injectable()
export class PrismaKittenRepository implements KittenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<KittenEntity | null> {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id },
      include: {
        stats: true,
        abilities: true,
      },
    });

    return kitten;
  }

  async findByUserId(userId: string): Promise<KittenEntity[]> {
    return this.prisma.kitten.findMany({
      where: { userId },
      include: {
        stats: true,
        abilities: true,
      },
    });
  }

  async findByName(name: string): Promise<KittenEntity | null> {
    return this.prisma.kitten.findFirst({
      where: { name },
    });
  }

  async save(kitten: KittenEntity): Promise<KittenEntity> {
    // Si l'ID existe, mise à jour, sinon création
    if (await this.findById(kitten.id)) {
      return this.prisma.kitten.update({
        where: { id: kitten.id },
        data: {
          name: kitten.name,
          level: kitten.level,
          experience: kitten.experience,
          strength: kitten.strength,
          agility: kitten.agility,
          constitution: kitten.constitution,
          intelligence: kitten.intelligence,
          skillPoints: kitten.skillPoints,
          avatarUrl: kitten.avatarUrl,
          userId: kitten.userId,
        },
      });
    } else {
      // Pour une nouvelle création, on va omettre l'ID pour que Prisma le génère
      const { id, ...kittenData } = kitten;
      return this.prisma.kitten.create({
        data: kittenData,
      });
    }
  }

  async delete(id: string): Promise<void> {
    // D'abord supprimer les statistiques associées
    await this.prisma.kittenStats.deleteMany({
      where: { kittenId: id },
    });

    // Ensuite supprimer le chaton
    await this.prisma.kitten.delete({
      where: { id },
    });
  }

  async updateExperience(id: string, experienceToAdd: number): Promise<KittenEntity> {
    const kitten = await this.findById(id);
    if (!kitten) {
      throw new Error(`Kitten with ID ${id} not found`);
    }

    const newExperience = kitten.experience + experienceToAdd;
    const experienceNeededForNextLevel = this.getExperienceForNextLevel(kitten.level);

    // Vérifier si le chaton gagne un niveau
    if (newExperience >= experienceNeededForNextLevel) {
      return this.prisma.kitten.update({
        where: { id },
        data: {
          level: { increment: 1 },
          experience: newExperience - experienceNeededForNextLevel,
          skillPoints: { increment: 5 }, // 5 points de compétence par niveau
        },
      });
    } else {
      return this.prisma.kitten.update({
        where: { id },
        data: {
          experience: newExperience,
        },
      });
    }
  }

  async levelUp(id: string): Promise<KittenEntity> {
    return this.prisma.kitten.update({
      where: { id },
      data: {
        level: { increment: 1 },
        skillPoints: { increment: 5 },
      },
    });
  }

  async assignSkillPoints(
    id: string,
    skillPoints: {
      strength: number;
      agility: number;
      constitution: number;
      intelligence: number;
    },
  ): Promise<KittenEntity> {
    const kitten = await this.findById(id);
    if (!kitten) {
      throw new Error(`Kitten with ID ${id} not found`);
    }

    return this.prisma.kitten.update({
      where: { id },
      data: {
        strength: kitten.strength + skillPoints.strength,
        agility: kitten.agility + skillPoints.agility,
        constitution: kitten.constitution + skillPoints.constitution,
        intelligence: kitten.intelligence + skillPoints.intelligence,
        skillPoints: kitten.skillPoints - (
          skillPoints.strength +
          skillPoints.agility +
          skillPoints.constitution +
          skillPoints.intelligence
        ),
      },
      include: {
        stats: true,
        abilities: true,
      },
    });
  }

  private getExperienceForNextLevel(currentLevel: number): number {
    // Formule simple: 100 * niveau actuel
    return 100 * currentLevel;
  }
}
