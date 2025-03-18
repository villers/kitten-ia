import { PartialType } from '@nestjs/swagger';
import { CreateAbilityDto } from '@/abilities/dto/create-ability.dto';

export class UpdateAbilityDto extends PartialType(CreateAbilityDto) {}
