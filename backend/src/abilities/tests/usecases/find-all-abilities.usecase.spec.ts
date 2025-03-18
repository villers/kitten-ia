import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { FindAllAbilitiesUseCase } from '@/abilities/application/usecases/find-all-abilities.usecase';
import { AbilityFixture, createAbilityFixture } from '@/abilities/tests/ability-fixture';
import { abilityBuilder } from '@/abilities/tests/ability-builder';

describe('FindAllAbilitiesUseCase', () => {
  let fixture: AbilityFixture;
  let findAllAbilitiesUseCase: FindAllAbilitiesUseCase;
  
  const kittenId1 = 'kitten-1';
  const kittenId2 = 'kitten-2';

  beforeEach(() => {
    fixture = createAbilityFixture();
    findAllAbilitiesUseCase = new FindAllAbilitiesUseCase(fixture.getAbilityRepository());
    
    // Créer des capacités de test pour deux chatons différents
    const ability1 = abilityBuilder()
      .withId('ability-1')
      .withName('Scratch Attack')
      .withDescription('A powerful scratch attack')
      .withType(AbilityType.ATTACK)
      .withPower(30)
      .withAccuracy(90)
      .withCooldown(2)
      .withKittenId(kittenId1)
      .build();
    
    const ability2 = abilityBuilder()
      .withId('ability-2')
      .withName('Healing Purr')
      .withDescription('A soothing purr that heals')
      .withType(AbilityType.HEAL)
      .withPower(25)
      .withAccuracy(100)
      .withCooldown(3)
      .withKittenId(kittenId1)
      .build();
    
    const ability3 = abilityBuilder()
      .withId('ability-3')
      .withName('Quick Dodge')
      .withDescription('Dodge the next attack')
      .withType(AbilityType.DEFENSE)
      .withPower(1)
      .withAccuracy(95)
      .withCooldown(2)
      .withKittenId(kittenId2)
      .build();
    
    fixture.givenAbilityExists([ability1, ability2, ability3]);
  });

  it('should find all abilities', async () => {
    // Given
    const query = {};

    // When
    try {
      const abilities = await findAllAbilitiesUseCase.execute(query);
      fixture.setResult(abilities);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    fixture.thenResultShouldBeArray();
    fixture.thenResultShouldHaveLength(3);
  });

  it('should find abilities for a specific kitten', async () => {
    // Given
    const query = {
      kittenId: kittenId1
    };

    // When
    try {
      const abilities = await findAllAbilitiesUseCase.execute(query);
      fixture.setResult(abilities);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    fixture.thenResultShouldBeArray();
    fixture.thenResultShouldHaveLength(2);
    fixture.thenAllResultItemsShouldHaveProperty('kittenId', kittenId1);
  });

  it('should return empty array when no abilities found for a kitten', async () => {
    // Given
    const query = {
      kittenId: 'non-existent-kitten'
    };

    // When
    try {
      const abilities = await findAllAbilitiesUseCase.execute(query);
      fixture.setResult(abilities);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    fixture.thenResultShouldBeArray();
    fixture.thenResultShouldHaveLength(0);
  });
});
