import { Injectable } from '@nestjs/common';
import { Kitten } from '../../core/domain/entities/kitten.entity';
import { CreateKittenDto as PresentationCreateKittenDto } from '../dto/kitten/create-kitten.dto';
import { CreateKittenDto as ApplicationCreateKittenDto } from '../../core/application/use-cases/kitten/dto/create-kitten.dto';

@Injectable()
export class KittenMapper {
  /**
   * Maps a domain entity to a DTO for API response
   */
  toDto(kitten: Kitten): any {
    return {
      id: kitten.id.value,
      name: kitten.name.value,
      level: kitten.level,
      experience: kitten.experience.value,
      strength: kitten.strength.value,
      agility: kitten.agility.value,
      constitution: kitten.constitution.value,
      intelligence: kitten.intelligence.value,
      skillPoints: kitten.skillPoints.value,
      avatarUrl: kitten.avatarUrl,
      userId: kitten.userId.value,
      health: kitten.calculateHealth(),
      damage: kitten.calculateBaseDamage(),
      createdAt: kitten.createdAt,
      updatedAt: kitten.updatedAt
    };
  }

  /**
   * Maps a presentation DTO to an application DTO
   */
  toApplicationDto(dto: PresentationCreateKittenDto): ApplicationCreateKittenDto {
    return {
      name: dto.name,
      strength: dto.strength,
      agility: dto.agility,
      constitution: dto.constitution,
      intelligence: dto.intelligence,
      avatarUrl: dto.avatarUrl
    };
  }
}