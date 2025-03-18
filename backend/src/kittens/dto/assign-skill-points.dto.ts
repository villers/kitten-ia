import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AssignSkillPointsDto {
  @ApiProperty({ example: 1, description: 'Points to add to strength' })
  @IsInt()
  @Min(0)
  strength: number;

  @ApiProperty({ example: 2, description: 'Points to add to agility' })
  @IsInt()
  @Min(0)
  agility: number;

  @ApiProperty({ example: 1, description: 'Points to add to constitution' })
  @IsInt()
  @Min(0)
  constitution: number;

  @ApiProperty({ example: 2, description: 'Points to add to intelligence' })
  @IsInt()
  @Min(0)
  intelligence: number;
}
