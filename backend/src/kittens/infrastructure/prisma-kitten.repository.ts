import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { KittenRepository } from '@/kittens/application/kitten.repository';
import { Kitten } from '@/kittens/domain/kitten';
import { KittenName } from '@/kittens/domain/kitten-name';
import { KittenAttributes } from '@/kittens/domain/kitten-attributes';
import { AttributeValue } from '@/kittens/domain/attribute-value';

@Injectable()
export class PrismaKittenRepository implements KittenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Kitten | null> {
    const kittenRecord = await this.prisma.kitten.findUnique({
      where: { id },
    });

    if (!kittenRecord) {
      return null;
    }

    return this.mapToDomain(kittenRecord);
  }

  async findByName(name: string): Promise<Kitten | null> {
    const kittenRecord = await this.prisma.kitten.findFirst({
      where: { name },
    });

    if (!kittenRecord) {
      return null;
    }

    return this.mapToDomain(kittenRecord);
  }

  async findByUserId(userId: string): Promise<Kitten[]> {
    const kittenRecords = await this.prisma.kitten.findMany({
      where: { userId },
    });

    return kittenRecords.map(this.mapToDomain);
  }

  async findAll(): Promise<Kitten[]> {
    const kittenRecords = await this.prisma.kitten.findMany();
    return kittenRecords.map(this.mapToDomain);
  }

  async save(kitten: Kitten): Promise<Kitten> {
    const data = {
      name: kitten.name.value,
      userId: kitten.userId,
      level: kitten.level,
      experience: kitten.experience,
      skillPoints: kitten.skillPoints,
      strength: kitten.attributes.strength.value,
      agility: kitten.attributes.agility.value,
      constitution: kitten.attributes.constitution.value,
      intelligence: kitten.attributes.intelligence.value,
      avatarUrl: kitten.avatarUrl,
      updatedAt: kitten.updatedAt,
    };

    const savedKitten = await this.prisma.kitten.upsert({
      where: { id: kitten.id },
      update: data,
      create: {
        id: kitten.id,
        ...data,
        createdAt: kitten.createdAt,
      },
    });

    return this.mapToDomain(savedKitten);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.kittenStats.deleteMany({
        where: { kittenId: id },
      });
      
      await this.prisma.ability.updateMany({
        where: { kittenId: id },
        data: { kittenId: null as any },
      });
      
      await this.prisma.kitten.delete({
        where: { id },
      });
    } catch (error) {
      // Handle any deletion errors
      console.error(`Error deleting kitten with ID ${id}:`, error);
      throw error;
    }
  }

  async isOwner(kittenId: string, userId: string): Promise<boolean> {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id: kittenId },
      select: { userId: true }
    });
    
    return kitten?.userId === userId;
  }

  async updateStats(winnerId: string, loserId: string): Promise<void> {
    // Récupérer les statistiques actuelles des deux chatons
    const [winnerStats, loserStats] = await Promise.all([
      this.prisma.kittenStats.findFirst({ where: { kittenId: winnerId } }),
      this.prisma.kittenStats.findFirst({ where: { kittenId: loserId } })
    ]);

    // Si les statistiques n'existent pas, les créer avec des valeurs par défaut
    if (!winnerStats) {
      await this.prisma.kittenStats.create({
        data: { kittenId: winnerId, wins: 1, losses: 0 }
      });
    } else {
      await this.prisma.kittenStats.update({
        where: { id: winnerStats.id },
        data: { wins: winnerStats.wins + 1 }
      });
    }

    if (!loserStats) {
      await this.prisma.kittenStats.create({
        data: { kittenId: loserId, wins: 0, losses: 1 }
      });
    } else {
      await this.prisma.kittenStats.update({
        where: { id: loserStats.id },
        data: { losses: loserStats.losses + 1 }
      });
    }
  }

  async updateExperience(kittenId: string, experienceGain: number): Promise<void> {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id: kittenId }
    });

    if (!kitten) return;

    // Calculer la nouvelle expérience et le niveau potentiellement mis à jour
    const newExperience = kitten.experience + experienceGain;
    let newLevel = kitten.level;
    let experienceForNextLevel = this.calculateExperienceForLevel(newLevel + 1);
    
    // Vérifier si le chaton a suffisamment d'expérience pour monter de niveau
    while (newExperience >= experienceForNextLevel) {
      newLevel++;
      experienceForNextLevel = this.calculateExperienceForLevel(newLevel + 1);
    }

    // Mettre à jour le chaton avec la nouvelle expérience et le niveau
    await this.prisma.kitten.update({
      where: { id: kittenId },
      data: {
        experience: newExperience,
        level: newLevel,
        // Ajouter des points de compétence si le niveau a augmenté
        skillPoints: kitten.skillPoints + (newLevel - kitten.level)
      }
    });
  }

  private calculateExperienceForLevel(level: number): number {
    // Formule simple pour calculer l'expérience nécessaire pour un niveau donné
    // Peut être ajustée selon les besoins du jeu
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  private mapToDomain(record: any): Kitten {
    return new Kitten(
      record.id,
      KittenName.of(record.name),
      record.userId,
      record.level,
      record.experience,
      record.skillPoints,
      new KittenAttributes(
        AttributeValue.of(record.strength),
        AttributeValue.of(record.agility),
        AttributeValue.of(record.constitution),
        AttributeValue.of(record.intelligence)
      ),
      record.createdAt,
      record.updatedAt,
      record.avatarUrl
    );
  }
}
