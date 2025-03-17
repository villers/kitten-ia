import { Injectable, Inject } from '@nestjs/common';
import { IKittenRepository } from '../../../domain/repositories/kitten.repository.interface';
import { Kitten } from '../../../domain/entities/kitten.entity';
import { KittenId } from '../../../domain/value-objects/kitten-id.value-object';
import { AssignSkillPointsDto } from './dto/assign-skill-points.dto';

@Injectable()
export class AssignSkillPointsUseCase {
  constructor(
    @Inject('IKittenRepository')
    private readonly kittenRepository: IKittenRepository
  ) {}

  async execute(
    kittenId: string, 
    assignSkillPointsDto: AssignSkillPointsDto, 
    userId: string
  ): Promise<Kitten> {
    // Find kitten
    const kittenIdObj = new KittenId(kittenId);
    const kitten = await this.kittenRepository.findById(kittenIdObj);
    
    if (!kitten) {
      throw new Error(`Kitten with ID ${kittenId} not found`);
    }

    // Check if kitten belongs to user
    if (kitten.userId.value !== userId) {
      throw new Error('You can only update your own kittens');
    }

    // Assign skill points
    const updatedKitten = kitten.assignSkillPoints({
      strength: assignSkillPointsDto.strength,
      agility: assignSkillPointsDto.agility,
      constitution: assignSkillPointsDto.constitution,
      intelligence: assignSkillPointsDto.intelligence,
    });

    // Save updated kitten
    return this.kittenRepository.save(updatedKitten);
  }
}