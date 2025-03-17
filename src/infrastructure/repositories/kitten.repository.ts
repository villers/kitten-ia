import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { IKittenRepository } from '../../core/domain/repositories/kitten.repository.interface';
import { Kitten } from '../../core/domain/entities/kitten.entity';
import { KittenId } from '../../core/domain/value-objects/kitten-id.value-object';
import { UserId } from '../../core/domain/value-objects/user-id.value-object';
import { KittenName } from '../../core/domain/value-objects/kitten-name.value-object';
import { KittenStat } from '../../core/domain/value-objects/kitten-stat.value-object';
import { Experience } from '../../core/domain/value-objects/experience.value-object';
import { SkillPoints } from '../../core/domain/value-objects/skill-points.value-object';

@Injectable()
export class KittenRepository implements IKittenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: KittenId): Promise<Kitten | null> {
    const kittenData = await this.prisma.kitten.findUnique({
      where: { id: id.value },
      include: {
        stats: true,
      },
    });

    if (!kittenData) {
      return null;
    }

    return this.mapToDomain(kittenData);
  }

  async findByUserId(userId: UserId): Promise<Kitten[]> {
    const kittensData = await this.prisma.kitten.findMany({
      where: { userId: userId.value },
      include: {
        stats: true,
      },
    });

    return kittensData.map(kitten => this.mapToDomain(kitten));
  }

  async findAll(): Promise<Kitten[]> {
    const kittensData = await this.prisma.kitten.findMany({
      include: {
        stats: true,
      },
    });

    return kittensData.map(kitten => this.mapToDomain(kitten));
  }

  async save(kitten: Kitten): Promise<Kitten> {
    const kittenData = await this.prisma.kitten.upsert({
      where: { id: kitten.id.value },
      update: {
        name: kitten.name.value,
        strength: kitten.strength.value,
        agility: kitten.agility.value,
        constitution: kitten.constitution.value,
        intelligence: kitten.intelligence.value,
        experience: kitten.experience.value,
        skillPoints: kitten.skillPoints.value,
        level: kitten.level,
        avatarUrl: kitten.avatarUrl,
        updatedAt: new Date(),
      },
      create: {
        id: kitten.id.value,
        userId: kitten.userId.value,
        name: kitten.name.value,
        strength: kitten.strength.value,
        agility: kitten.agility.value,
        constitution: kitten.constitution.value,
        intelligence: kitten.intelligence.value,
        experience: kitten.experience.value,
        skillPoints: kitten.skillPoints.value,
        level: kitten.level,
        avatarUrl: kitten.avatarUrl,
        createdAt: kitten.createdAt,
        updatedAt: kitten.updatedAt,
        stats: {
          create: {
            wins: 0,
            losses: 0,
            draws: 0,
          },
        },
      },
      include: {
        stats: true,
      },
    });

    return this.mapToDomain(kittenData);
  }

  async delete(id: KittenId): Promise<void> {
    // Delete associated stats first (due to foreign key constraints)
    await this.prisma.kittenStats.deleteMany({
      where: { kittenId: id.value },
    });

    await this.prisma.kitten.delete({
      where: { id: id.value },
    });
  }

  async existsByNameAndUserId(name: string, userId: UserId): Promise<boolean> {
    const kitten = await this.prisma.kitten.findFirst({
      where: {
        name,
        userId: userId.value,
      },
    });

    return !!kitten;
  }

  private mapToDomain(kittenData: any): Kitten {
    return new Kitten({
      id: new KittenId(kittenData.id),
      userId: new UserId(kittenData.userId),
      name: new KittenName(kittenData.name),
      strength: new KittenStat(kittenData.strength),
      agility: new KittenStat(kittenData.agility),
      constitution: new KittenStat(kittenData.constitution),
      intelligence: new KittenStat(kittenData.intelligence),
      experience: new Experience(kittenData.experience),
      skillPoints: new SkillPoints(kittenData.skillPoints),
      avatarUrl: kittenData.avatarUrl,
      createdAt: kittenData.createdAt,
      updatedAt: kittenData.updatedAt,
    });
  }
}