import { Injectable } from '@nestjs/common';
import { AbilityType } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { AbilityRepository } from '@/abilities/application/ability.repository';
import { Ability } from '@/abilities/domain/ability';

@Injectable()
export class PrismaAbilityRepository implements AbilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Ability | null> {
    const ability = await this.prisma.ability.findUnique({
      where: { id }
    });

    if (!ability) {
      return null;
    }

    return this.mapToDomain(ability);
  }

  async findByKittenId(kittenId: string): Promise<Ability[]> {
    const abilities = await this.prisma.ability.findMany({
      where: { kittenId }
    });

    return abilities.map(ability => this.mapToDomain(ability));
  }

  async findAll(): Promise<Ability[]> {
    const abilities = await this.prisma.ability.findMany();
    
    return abilities.map(ability => this.mapToDomain(ability));
  }

  async save(ability: Ability): Promise<Ability> {
    const data = {
      name: ability.name,
      description: ability.description,
      type: ability.type,
      power: ability.power,
      accuracy: ability.accuracy,
      cooldown: ability.cooldown,
      kittenId: ability.kittenId,
    };

    const savedAbility = await this.prisma.ability.upsert({
      where: { id: ability.id },
      update: data,
      create: {
        id: ability.id,
        ...data,
      },
    });

    return this.mapToDomain(savedAbility);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ability.delete({
      where: { id }
    });
  }

  private mapToDomain(ability: {
    id: string;
    name: string;
    description: string;
    type: AbilityType;
    power: number;
    accuracy: number;
    cooldown: number;
    kittenId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Ability {
    return new Ability(
      ability.id,
      ability.name,
      ability.description,
      ability.type,
      ability.power,
      ability.accuracy,
      ability.cooldown,
      ability.kittenId,
      ability.createdAt,
      ability.updatedAt
    );
  }
}
