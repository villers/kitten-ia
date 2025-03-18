import { Inject } from '@nestjs/common';
import { AbilityRepository } from '../ability.repository';
import { Ability } from '../../domain/ability';
import { AbilityNotFoundError } from '../../domain/errors';
import { ABILITY_REPOSITORY } from '../../tokens/tokens';

export interface FindAbilityByIdQuery {
  id: string;
}

export class FindAbilityByIdUseCase {
  constructor(
    @Inject(ABILITY_REPOSITORY)
    private readonly abilityRepository: AbilityRepository
  ) {}

  async execute(query: FindAbilityByIdQuery): Promise<Ability> {
    const ability = await this.abilityRepository.findById(query.id);
    
    if (!ability) {
      throw new AbilityNotFoundError(query.id);
    }
    
    return ability;
  }
}
