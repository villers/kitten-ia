import { PartialType } from '@nestjs/swagger';
import { CreateKittenDto } from './create-kitten.dto';

export class UpdateKittenDto extends PartialType(CreateKittenDto) {}
