import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Min, Max, IsInt } from 'class-validator';

export class CreateKittenDto {
  @ApiProperty({ example: 'Whiskers', description: 'The name of the kitten' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 7, description: 'Strength attribute', default: 5 })
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  strength?: number;

  @ApiProperty({ example: 8, description: 'Agility attribute', default: 5 })
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  agility?: number;

  @ApiProperty({ example: 6, description: 'Constitution attribute', default: 5 })
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  constitution?: number;

  @ApiProperty({ example: 9, description: 'Intelligence attribute', default: 5 })
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  intelligence?: number;

  @ApiProperty({ example: 'https://example.com/kitten.jpg', description: 'Avatar URL' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}