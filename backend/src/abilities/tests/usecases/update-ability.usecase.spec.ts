import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { UpdateAbilityUseCase } from '@/abilities/application/usecases/update-ability.usecase';
import { AbilityNotFoundError, NotKittenOwnerError } from '@/abilities/domain/errors';
import { AbilityFixture, createAbilityFixture } from '@/abilities/tests/ability-fixture';
import { abilityBuilder } from '@/abilities/tests/ability-builder';

describe('UpdateAbilityUseCase', () => {
  let fixture: AbilityFixture;
  let updateAbilityUseCase: UpdateAbilityUseCase;
  
  const abilityId = 'ability-1';
  const kittenId = 'kitten-1';
  const userId = 'user-1';

  beforeEach(() => {
    fixture = createAbilityFixture();
    updateAbilityUseCase = new UpdateAbilityUseCase(
      fixture.getAbilityRepository(),
      fixture.getKittenRepository()
    );
    
    // Ajouter un chaton
    fixture.givenKittenExists([{
      id: kittenId,
      userId
    }]);
    
    // Créer une capacité de test
    const ability = abilityBuilder()
      .withId(abilityId)
      .withName('Scratch Attack')
      .withDescription('A powerful scratch attack')
      .withType(AbilityType.ATTACK)
      .withPower(30)
      .withAccuracy(90)
      .withCooldown(2)
      .withKittenId(kittenId)
      .build();
    
    fixture.givenAbilityExists([ability]);
  });

  it('should update an ability with new values', async () => {
    // Given
    const command = {
      id: abilityId,
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
    expect(updatedAbility.description).toBe('A powerful scratch attack'); // Unchanged
    expect(updatedAbility.type).toBe(AbilityType.ATTACK); // Unchanged
    expect(updatedAbility.cooldown).toBe(2); // Unchanged
    
    // Verify that the ability was saved
    const savedAbility = await fixture.getAbilityRepository().findById(updatedAbility.id);
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
      id: abilityId,
      userId: 'different-user',
      name: 'New Name'
    };

    // When & Then
    await expect(updateAbilityUseCase.execute(command)).rejects.toThrow(NotKittenOwnerError);
  });

  it('should throw error when no fields are provided for update', async () => {
    // Given
    const command = {
      id: abilityId,
      userId
    };

    // When & Then
    await expect(updateAbilityUseCase.execute(command)).rejects.toThrow('At least one field must be provided for update');
  });
});
