import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';

@Injectable()
export class AbilitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createAbilityDto: CreateAbilityDto, kittenId: string, userId: string) {
    // Vérifier si le chaton appartient à l'utilisateur
    const kitten = await this.prisma.kitten.findUnique({
      where: { id: kittenId },
    });

    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${kittenId} not found`);
    }

    if (kitten.userId !== userId) {
      throw new ForbiddenException('You can only create abilities for your own kittens');
    }

    return this.prisma.ability.create({
      data: {
        ...createAbilityDto,
        kittenId,
      },
    });
  }

  async findAll(kittenId?: string) {
    const where = kittenId ? { kittenId } : {};
    
    return this.prisma.ability.findMany({
      where,
    });
  }

  async findOne(id: string) {
    const ability = await this.prisma.ability.findUnique({
      where: { id },
      include: {
        kitten: true,
      },
    });

    if (!ability) {
      throw new NotFoundException(`Ability with ID ${id} not found`);
    }

    return ability;
  }

  async update(id: string, updateAbilityDto: UpdateAbilityDto, userId: string) {
    // Vérifier si la capacité existe
    const ability = await this.prisma.ability.findUnique({
      where: { id },
      include: {
        kitten: true,
      },
    });

    if (!ability) {
      throw new NotFoundException(`Ability with ID ${id} not found`);
    }

    // Vérifier si l'utilisateur est le propriétaire du chaton
    if (ability.kitten.userId !== userId) {
      throw new ForbiddenException('You can only update abilities for your own kittens');
    }

    return this.prisma.ability.update({
      where: { id },
      data: updateAbilityDto,
    });
  }

  async remove(id: string, userId: string) {
    // Vérifier si la capacité existe
    const ability = await this.prisma.ability.findUnique({
      where: { id },
      include: {
        kitten: true,
      },
    });

    if (!ability) {
      throw new NotFoundException(`Ability with ID ${id} not found`);
    }

    // Vérifier si l'utilisateur est le propriétaire du chaton
    if (ability.kitten.userId !== userId) {
      throw new ForbiddenException('You can only delete abilities for your own kittens');
    }

    return this.prisma.ability.delete({
      where: { id },
    });
  }
}
