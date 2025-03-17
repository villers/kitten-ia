import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class AssignSkillPointsDto {
  @ApiProperty({ example: 1, description: 'Points to add to strength' })
  @IsInt()
  @Min(0)
  @Max(20)
  strength: number;

  @ApiProperty({ example: 1, description: 'Points to add to agility' })
  @IsInt()
  @Min(0)
  @Max(20)
  agility: number;

  @ApiProperty({ example: 1, description: 'Points to add to constitution' })
  @IsInt()
  @Min(0)
  @Max(20)
  constitution: number;

  @ApiProperty({ example: 1, description: 'Points to add to intelligence' })
  @IsInt()
  @Min(0)
  @Max(20)
  intelligence: number;
}