import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Min, Max, IsInt } from 'class-validator';

export class UpdateKittenDto {
  @ApiProperty({ example: 'Whiskers', description: 'The name of the kitten' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'https://example.com/kitten.jpg', description: 'Avatar URL' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}