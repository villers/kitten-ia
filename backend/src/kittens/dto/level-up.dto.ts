import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class LevelUpDto {
  @ApiProperty({ example: 3, description: 'Number of skill points to add per level', required: false })
  @IsInt()
  @IsOptional()
  @Min(1)
  skillPointsPerLevel?: number;
}
