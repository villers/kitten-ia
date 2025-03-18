import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddExperienceDto {
  @ApiProperty({ example: 50, description: 'Amount of experience to add' })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  experience: number;
}
