import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { Ability } from '../../domain/ability';
import { DeleteAbilityUseCase } from '../../application/usecases/delete-ability.usecase';
import { InMemoryAbilityRepository } from '../in-memory-ability-repository';
import { InMemoryKittenRepository } from '../in-memory-kitten-repository';
import { AbilityNotFoundError, NotKittenOwnerError } from '../../domain/errors';

describe('DeleteAbilityUseCase', () => {
  let abilityRepository: InMemoryAbilityRepository;
  let kittenRepository: InMemoryKittenRepository;
  let deleteAbilityUseCase: DeleteAbilityUseCase;
  let sampleAbility: Ability;
  
  const kittenId = 'kitten-1';
  const userId = 'user-1';

  beforeEach(() => {
    abilityRepository = new InMemoryAbilityRepository();
    kittenRepository = new InMemoryKittenRepository();
    deleteAbilityUseCase = new DeleteAbilityUseCase(abilityRepository, kittenRepository);
    
    // Ajouter un chaton
    kittenRepository.addKitten({
      id: kittenId,
      userId
    });
    
    // Créer une capacité de test
    sampleAbility = new Ability(
      'ability-1',
      'Scratch Attack',
      'A powerful scratch attack',
      AbilityType.ATTACK,
      30,
      90,
      2,
      kittenId,
      new Date(),
      new Date()
    );
    
    abilityRepository.addAbility(sampleAbility);
  });

  it('should delete an ability', async () => {
    // Given
    const command = {
      id: sampleAbility.id,
      userId
    };

    // When
    await deleteAbilityUseCase.execute(command);

    // Then
    const deletedAbility = await abilityRepository.findById(sampleAbility.id);
    expect(deletedAbility).toBeNull();
  });

  it('should throw AbilityNotFoundError when ability does not exist', async () => {
    // Given
    const command = {
      id: 'non-existent-ability',
      userId
    };

    // When & Then
    await expect(deleteAbilityUseCase.execute(command)).rejects.toThrow(AbilityNotFoundError);
  });

  it('should throw NotKittenOwnerError when user is not the owner', async () => {
    // Given
    const command = {
      id: sampleAbility.id,
      userId: 'different-user'
    };

    // When & Then
    await expect(deleteAbilityUseCase.execute(command)).rejects.toThrow(NotKittenOwnerError);
  });
});
