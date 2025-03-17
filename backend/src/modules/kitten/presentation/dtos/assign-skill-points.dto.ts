import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSkillPointsDto {
  @ApiProperty({ description: 'Points à ajouter à la force', minimum: 0 })
  @IsNumber()
  @Min(0)
  strength: number;

  @ApiProperty({ description: 'Points à ajouter à l\'agilité', minimum: 0 })
  @IsNumber()
  @Min(0)
  agility: number;

  @ApiProperty({ description: 'Points à ajouter à la constitution', minimum: 0 })
  @IsNumber()
  @Min(0)
  constitution: number;

  @ApiProperty({ description: 'Points à ajouter à l\'intelligence', minimum: 0 })
  @IsNumber()
  @Min(0)
  intelligence: number;
}
