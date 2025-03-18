import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { CreateAbilityUseCase } from '../../application/usecases/create-ability.usecase';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';
import { AbilityFixture, createAbilityFixture } from '../ability-fixture';

describe('CreateAbilityUseCase', () => {
  let fixture: AbilityFixture;
  let createAbilityUseCase: CreateAbilityUseCase;

  beforeEach(() => {
    fixture = createAbilityFixture();
    fixture.givenCurrentDate(new Date('2023-01-01T00:00:00Z'));
    
    createAbilityUseCase = new CreateAbilityUseCase(
      fixture.getAbilityRepository(),
      fixture.getKittenRepository()
    );
    createAbilityUseCase.setDateProvider(() => fixture.getCurrentDate());
    
    // Ajouter un chaton pour les tests
    fixture.givenKittenExists([{
      id: 'kitten-1',
      userId: 'user-1'
    }]);
  });

  it('should create an ability with valid data', async () => {
    // Given
    const command = {
      name: 'Scratch Attack',
      description: 'A powerful scratch attack',
      type: AbilityType.ATTACK,
      power: 30,
      accuracy: 90,
      cooldown: 2,
      kittenId: 'kitten-1',
      userId: 'user-1'
    };

    // When
    const ability = await createAbilityUseCase.execute(command);

    // Then
    expect(ability.id).toBeDefined();
    expect(ability.name).toBe(command.name);
    expect(ability.description).toBe(command.description);
    expect(ability.type).toBe(command.type);
    expect(ability.power).toBe(command.power);
    expect(ability.accuracy).toBe(command.accuracy);
    expect(ability.cooldown).toBe(command.cooldown);
    expect(ability.kittenId).toBe(command.kittenId);
    expect(ability.createdAt).toBe(fixture.getCurrentDate());
    expect(ability.updatedAt).toBe(fixture.getCurrentDate());

    // Verify that the ability was saved
    const savedAbility = await fixture.getAbilityRepository().findById(ability.id);
    expect(savedAbility).not.toBeNull();
  });

  it('should throw KittenNotFoundError when kitten does not exist', async () => {
    // Given
    const command = {
      name: 'Scratch Attack',
      description: 'A powerful scratch attack',
      type: AbilityType.ATTACK,
      power: 30,
      accuracy: 90,
      cooldown: 2,
      kittenId: 'non-existent-kitten',
      userId: 'user-1'
    };

    // When & Then
    await expect(createAbilityUseCase.execute(command)).rejects.toThrow(KittenNotFoundError);
  });

  it('should throw NotKittenOwnerError when user is not the owner', async () => {
    // Given
    const command = {
      name: 'Scratch Attack',
      description: 'A powerful scratch attack',
      type: AbilityType.ATTACK,
      power: 30,
      accuracy: 90,
      cooldown: 2,
      kittenId: 'kitten-1',
      userId: 'different-user'
    };

    // When & Then
    await expect(createAbilityUseCase.execute(command)).rejects.toThrow(NotKittenOwnerError);
  });
});
