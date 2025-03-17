import { Injectable, Inject } from '@nestjs/common';
import { IKittenRepository } from '../../../domain/repositories/kitten.repository.interface';
import { Kitten } from '../../../domain/entities/kitten.entity';
import { KittenId } from '../../../domain/value-objects/kitten-id.value-object';

@Injectable()
export class GetKittenUseCase {
  constructor(
    @Inject('IKittenRepository')
    private readonly kittenRepository: IKittenRepository
  ) {}

  async execute(id: string): Promise<Kitten> {
    const kittenId = new KittenId(id);
    const kitten = await this.kittenRepository.findById(kittenId);
    
    if (!kitten) {
      throw new Error(`Kitten with ID ${id} not found`);
    }
    
    return kitten;
  }
}