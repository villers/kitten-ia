import { PartialType } from '@nestjs/swagger';
import { CreateKittenDto } from '@/kittens/dto/create-kitten.dto';

export class UpdateKittenDto extends PartialType(CreateKittenDto) {}
