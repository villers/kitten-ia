import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { FindAbilityByIdUseCase } from '@/abilities/application/usecases/find-ability-by-id.usecase';
import { AbilityNotFoundError } from '@/abilities/domain/errors';
import { AbilityFixture, createAbilityFixture } from '@/abilities/tests/ability-fixture';
import { abilityBuilder } from '@/abilities/tests/ability-builder';

describe('FindAbilityByIdUseCase', () => {
  let fixture: AbilityFixture;
  let findAbilityByIdUseCase: FindAbilityByIdUseCase;
  const abilityId = 'ability-1';

  beforeEach(() => {
    fixture = createAbilityFixture();
    findAbilityByIdUseCase = new FindAbilityByIdUseCase(fixture.getAbilityRepository());
    
    // Créer une capacité de test
    const ability = abilityBuilder()
      .withId(abilityId)
      .withName('Scratch Attack')
      .withDescription('A powerful scratch attack')
      .withType(AbilityType.ATTACK)
      .withPower(30)
      .withAccuracy(90)
      .withCooldown(2)
      .withKittenId('kitten-1')
      .build();
    
    fixture.givenAbilityExists([ability]);
  });

  it('should find an ability by its id', async () => {
    // Given
    const query = {
      id: abilityId
    };

    // When
    const ability = await findAbilityByIdUseCase.execute(query);

    // Then
    expect(ability.id).toBe(abilityId);
    expect(ability.name).toBe('Scratch Attack');
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
