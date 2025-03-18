import { Inject } from '@nestjs/common';
import { AbilityRepository } from '@/abilities/application/ability.repository';
import { Ability } from '@/abilities/domain/ability';
import { ABILITY_REPOSITORY } from '@/abilities/tokens/tokens';

export interface FindAllAbilitiesQuery {
  kittenId?: string;
}

export class FindAllAbilitiesUseCase {
  constructor(
    @Inject(ABILITY_REPOSITORY)
    private readonly abilityRepository: AbilityRepository
  ) {}

  async execute(query: FindAllAbilitiesQuery): Promise<Ability[]> {
    if (query.kittenId) {
      return this.abilityRepository.findByKittenId(query.kittenId);
    }
    
    return this.abilityRepository.findAll();
  }
}
