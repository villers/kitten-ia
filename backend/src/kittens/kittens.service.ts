import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKittenDto } from './dto/create-kitten.dto';
import { UpdateKittenDto } from './dto/update-kitten.dto';
import { AssignSkillPointsDto } from './dto/assign-skill-points.dto';

@Injectable()
export class KittensService {
  constructor(private prisma: PrismaService) {}

  async create(createKittenDto: CreateKittenDto, userId: string) {
    // Création d'un nouveau chaton
    const kitten = await this.prisma.kitten.create({
      data: {
        ...createKittenDto,
        userId,
      },
    });

    // Création des statistiques associées
    await this.prisma.kittenStats.create({
      data: {
        kittenId: kitten.id,
      },
    });

    // Récupération du chaton avec ses stats
    return this.findOne(kitten.id);
  }

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    
    return this.prisma.kitten.findMany({
      where,
      include: {
        stats: true,
        abilities: true,
      },
    });
  }

  async findOne(id: string) {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id },
      include: {
        stats: true,
        abilities: true,
      },
    });

    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${id} not found`);
    }

    return kitten;
  }

  async update(id: string, updateKittenDto: UpdateKittenDto, userId: string) {
    // Vérifier si le chaton appartient à l'utilisateur
    const kitten = await this.prisma.kitten.findUnique({
      where: { id },
    });

    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${id} not found`);
    }

    if (kitten.userId !== userId) {
      throw new ForbiddenException('You can only update your own kittens');
    }

    return this.prisma.kitten.update({
      where: { id },
      data: updateKittenDto,
      include: {
        stats: true,
        abilities: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    // Vérifier si le chaton appartient à l'utilisateur
    const kitten = await this.prisma.kitten.findUnique({
      where: { id },
    });

    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${id} not found`);
    }

    if (kitten.userId !== userId) {
      throw new ForbiddenException('You can only delete your own kittens');
    }

    // Supprimer les statistiques du chaton
    await this.prisma.kittenStats.delete({
      where: { kittenId: id },
    });

    // Supprimer le chaton
    return this.prisma.kitten.delete({
      where: { id },
    });
  }

  async assignSkillPoints(id: string, assignSkillPointsDto: AssignSkillPointsDto, userId: string) {
    // Récupérer le chaton
    const kitten = await this.prisma.kitten.findUnique({
      where: { id },
    });

    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${id} not found`);
    }

    if (kitten.userId !== userId) {
      throw new ForbiddenException('You can only update your own kittens');
    }

    // Calculer le total des points à assigner
    const totalPoints = 
      assignSkillPointsDto.strength + 
      assignSkillPointsDto.agility + 
      assignSkillPointsDto.constitution + 
      assignSkillPointsDto.intelligence;

    // Vérifier si le chaton a suffisamment de points de compétence disponibles
    if (totalPoints > kitten.skillPoints) {
      throw new BadRequestException(`Not enough skill points available. You have ${kitten.skillPoints} points left.`);
    }

    // Appliquer les points
    return this.prisma.kitten.update({
      where: { id },
      data: {
        strength: kitten.strength + assignSkillPointsDto.strength,
        agility: kitten.agility + assignSkillPointsDto.agility,
        constitution: kitten.constitution + assignSkillPointsDto.constitution,
        intelligence: kitten.intelligence + assignSkillPointsDto.intelligence,
        skillPoints: kitten.skillPoints - totalPoints,
      },
      include: {
        stats: true,
        abilities: true,
      },
    });
  }

  async assignAbility(kittenId: string, abilityId: string, userId: string) {
    // Vérifier si le chaton appartient à l'utilisateur
    const kitten = await this.prisma.kitten.findUnique({
      where: { id: kittenId },
    });

    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${kittenId} not found`);
    }

    if (kitten.userId !== userId) {
      throw new ForbiddenException('You can only update your own kittens');
    }

    // Vérifier si l'abilité existe
    const ability = await this.prisma.ability.findUnique({
      where: { id: abilityId },
    });

    if (!ability) {
      throw new NotFoundException(`Ability with ID ${abilityId} not found`);
    }

    // Assigner l'abilité au chaton
    return this.prisma.ability.update({
      where: { id: abilityId },
      data: {
        kittenId,
      },
    });
  }
}
