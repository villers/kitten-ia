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
