import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { Ability } from '../../domain/ability';
import { FindAbilityByIdUseCase } from '../../application/usecases/find-ability-by-id.usecase';
import { InMemoryAbilityRepository } from '../in-memory-ability-repository';
import { AbilityNotFoundError } from '../../domain/errors';

describe('FindAbilityByIdUseCase', () => {
  let abilityRepository: InMemoryAbilityRepository;
  let findAbilityByIdUseCase: FindAbilityByIdUseCase;
  let sampleAbility: Ability;

  beforeEach(() => {
    abilityRepository = new InMemoryAbilityRepository();
    findAbilityByIdUseCase = new FindAbilityByIdUseCase(abilityRepository);
    
    // Créer une capacité de test
    sampleAbility = new Ability(
      'ability-1',
      'Scratch Attack',
      'A powerful scratch attack',
      AbilityType.ATTACK,
      30,
      90,
      2,
      'kitten-1',
      new Date(),
      new Date()
    );
    
    abilityRepository.addAbility(sampleAbility);
  });

  it('should find an ability by its id', async () => {
    // Given
    const query = {
      id: sampleAbility.id
    };

    // When
    const ability = await findAbilityByIdUseCase.execute(query);

    // Then
    expect(ability).toEqual(sampleAbility);
  });

  it('should throw AbilityNotFoundError when ability does not exist', async () => {
    // Given
    const query = {
      id: 'non-existent-ability'
    };

    // When & Then
    await expect(findAbilityByIdUseCase.execute(query)).rejects.toThrow(AbilityNotFoundError);
  });
});
