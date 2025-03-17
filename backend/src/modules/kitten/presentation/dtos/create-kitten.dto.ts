import { IsString, IsNumber, IsOptional, IsUrl, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKittenDto {
  @ApiProperty({ description: 'Le nom du chaton' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'La force du chaton', default: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  strength?: number;

  @ApiProperty({ description: 'L\'agilité du chaton', default: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  agility?: number;

  @ApiProperty({ description: 'La constitution du chaton', default: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  constitution?: number;

  @ApiProperty({ description: 'L\'intelligence du chaton', default: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  intelligence?: number;

  @ApiProperty({ description: 'L\'URL de l\'avatar du chaton', required: false })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
