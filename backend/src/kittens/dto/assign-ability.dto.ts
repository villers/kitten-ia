import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignAbilityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ability ID' })
  @IsString()
  @IsNotEmpty()
  abilityId: string;
}
