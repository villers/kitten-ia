import { describe, it, expect, beforeEach } from 'vitest';
import { AssignSkillPointsUseCase } from '@/kittens/application/usecases/assign-skill-points.usecase';
import { KittenFixture, createKittenFixture } from '@/kittens/tests/kitten-fixture';
import { kittenBuilder } from '@/kittens/tests/kitten-builder';
import { 
  KittenNotFoundError, 
  NotEnoughSkillPointsError, 
  NotKittenOwnerError 
} from '@/kittens/domain/errors';

describe('Assign Skill Points Use Case', () => {
  let fixture: KittenFixture;
  let assignSkillPointsUseCase: AssignSkillPointsUseCase;

  beforeEach(() => {
    fixture = createKittenFixture();
    assignSkillPointsUseCase = new AssignSkillPointsUseCase(
      fixture.getKittenRepository()
    );
  });

  it('should assign skill points correctly', async () => {
    // Given
    const userId = 'user-1';
    const kitten = kittenBuilder()
      .withId('kitten-1')
      .withUserId(userId)
      .withSkillPoints(10)
      .build();

    fixture.givenKittenExists([kitten]);

    // When
    const result = await assignSkillPointsUseCase.execute({
      kittenId: kitten.id,
      userId,
      strength: 2,
      agility: 3,
      constitution: 1,
      intelligence: 4
    });

    // Then
    expect(result.attributes.strength.value).toBe(7);
    expect(result.attributes.agility.value).toBe(8);
    expect(result.attributes.constitution.value).toBe(6);
    expect(result.attributes.intelligence.value).toBe(9);
    expect(result.skillPoints).toBe(0);
  });

  it('should throw KittenNotFoundError if kitten does not exist', async () => {
    // When & Then
    await expect(assignSkillPointsUseCase.execute({
      kittenId: 'non-existent-kitten',
      userId: 'user-1',
      strength: 1,
      agility: 1,
      constitution: 1,
      intelligence: 1
    })).rejects.toThrow(KittenNotFoundError);
  });

  it('should throw NotKittenOwnerError if user is not the owner', async () => {
    // Given
    const kitten = kittenBuilder()
      .withId('kitten-1')
      .withUserId('user-1')
      .withSkillPoints(10)
      .build();

    fixture.givenKittenExists([kitten]);

    // When & Then
    await expect(assignSkillPointsUseCase.execute({
      kittenId: kitten.id,
      userId: 'different-user',
      strength: 1,
      agility: 1,
      constitution: 1,
      intelligence: 1
    })).rejects.toThrow(NotKittenOwnerError);
  });

  it('should throw NotEnoughSkillPointsError if not enough skill points', async () => {
    // Given
    const userId = 'user-1';
    const kitten = kittenBuilder()
      .withId('kitten-1')
      .withUserId(userId)
      .withSkillPoints(5)
      .build();

    fixture.givenKittenExists([kitten]);

    // When & Then
    await expect(assignSkillPointsUseCase.execute({
      kittenId: kitten.id,
      userId,
      strength: 2,
      agility: 3,
      constitution: 1,
      intelligence: 4
    })).rejects.toThrow(NotEnoughSkillPointsError);
  });
});
