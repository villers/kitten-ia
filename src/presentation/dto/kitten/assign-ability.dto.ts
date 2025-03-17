import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignAbilityDto {
  @ApiProperty({ example: 'ability-123', description: 'ID of the ability to assign' })
  @IsString()
  @IsNotEmpty()
  abilityId: string;
}