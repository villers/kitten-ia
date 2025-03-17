import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { AbilityType } from '@prisma/client';

export class CreateAbilityDto {
  @ApiProperty({ example: 'Scratch Attack', description: 'The name of the ability' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A powerful scratch attack that deals physical damage',
    description: 'Description of the ability',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: AbilityType,
    example: AbilityType.ATTACK,
    description: 'Type of ability',
  })
  @IsEnum(AbilityType)
  type: AbilityType;

  @ApiProperty({ example: 30, description: 'Power of the ability' })
  @IsInt()
  @Min(1)
  @Max(100)
  power: number;

  @ApiProperty({ example: 90, description: 'Accuracy of the ability (percent)' })
  @IsInt()
  @Min(1)
  @Max(100)
  accuracy: number;

  @ApiProperty({ example: 2, description: 'Cooldown of the ability (rounds)', default: 0 })
  @IsInt()
  @Min(0)
  @Max(10)
  cooldown: number;
}
