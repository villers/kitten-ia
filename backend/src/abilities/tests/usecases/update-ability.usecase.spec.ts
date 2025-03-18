import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { Ability } from '../../domain/ability';
import { UpdateAbilityUseCase } from '../../application/usecases/update-ability.usecase';
import { InMemoryAbilityRepository } from '../in-memory-ability-repository';
import { InMemoryKittenRepository } from '../in-memory-kitten-repository';
import { AbilityNotFoundError, NotKittenOwnerError } from '../../domain/errors';

describe('UpdateAbilityUseCase', () => {
  let abilityRepository: InMemoryAbilityRepository;
  let kittenRepository: InMemoryKittenRepository;
  let updateAbilityUseCase: UpdateAbilityUseCase;
  let sampleAbility: Ability;
  
  const kittenId = 'kitten-1';
  const userId = 'user-1';

  beforeEach(() => {
    abilityRepository = new InMemoryAbilityRepository();
    kittenRepository = new InMemoryKittenRepository();
    updateAbilityUseCase = new UpdateAbilityUseCase(abilityRepository, kittenRepository);
    
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

  it('should update an ability with new values', async () => {
    // Given
    const command = {
      id: sampleAbility.id,
      userId,
      name: 'Super Scratch',
      power: 40,
      accuracy: 85
    };

    // When
    const updatedAbility = await updateAbilityUseCase.execute(command);

    // Then
    expect(updatedAbility.name).toBe(command.name);
    expect(updatedAbility.power).toBe(command.power);
    expect(updatedAbility.accuracy).toBe(command.accuracy);
    expect(updatedAbility.description).toBe(sampleAbility.description); // Unchanged
    expect(updatedAbility.type).toBe(sampleAbility.type); // Unchanged
    expect(updatedAbility.cooldown).toBe(sampleAbility.cooldown); // Unchanged
    
    // Verify that the ability was saved
    const savedAbility = await abilityRepository.findById(updatedAbility.id);
    expect(savedAbility?.name).toBe(command.name);
  });

  it('should throw AbilityNotFoundError when ability does not exist', async () => {
    // Given
    const command = {
      id: 'non-existent-ability',
      userId,
      name: 'New Name'
    };

    // When & Then
    await expect(updateAbilityUseCase.execute(command)).rejects.toThrow(AbilityNotFoundError);
  });

  it('should throw NotKittenOwnerError when user is not the owner', async () => {
    // Given
    const command = {
      id: sampleAbility.id,
      userId: 'different-user',
      name: 'New Name'
    };

    // When & Then
    await expect(updateAbilityUseCase.execute(command)).rejects.toThrow(NotKittenOwnerError);
  });

  it('should throw error when no fields are provided for update', async () => {
    // Given
    const command = {
      id: sampleAbility.id,
      userId
    };

    // When & Then
    await expect(updateAbilityUseCase.execute(command)).rejects.toThrow('At least one field must be provided for update');
  });
});
