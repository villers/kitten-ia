import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { DeleteAbilityUseCase } from '../../application/usecases/delete-ability.usecase';
import { AbilityNotFoundError, NotKittenOwnerError } from '../../domain/errors';
import { AbilityFixture, createAbilityFixture } from '../ability-fixture';
import { abilityBuilder } from '../ability-builder';

describe('DeleteAbilityUseCase', () => {
  let fixture: AbilityFixture;
  let deleteAbilityUseCase: DeleteAbilityUseCase;
  
  const abilityId = 'ability-1';
  const kittenId = 'kitten-1';
  const userId = 'user-1';

  beforeEach(() => {
    fixture = createAbilityFixture();
    deleteAbilityUseCase = new DeleteAbilityUseCase(
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

  it('should delete an ability', async () => {
    // Given
    const command = {
      id: abilityId,
      userId
    };

    // When
    await deleteAbilityUseCase.execute(command);

    // Then
    const deletedAbility = await fixture.getAbilityRepository().findById(abilityId);
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
      id: abilityId,
      userId: 'different-user'
    };

    // When & Then
    await expect(deleteAbilityUseCase.execute(command)).rejects.toThrow(NotKittenOwnerError);
  });
});
