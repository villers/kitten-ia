import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kitten } from '../../domain/kitten';
import { KittenAttributes } from '../../domain/kitten-attributes';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';
import { InMemoryKittenRepository } from '../in-memory-kitten-repository';
import { LevelUpUseCase } from '../../application/usecases/level-up.usecase';
import { kittenBuilder } from '../kitten-builder';

describe('LevelUpUseCase', () => {
  let repository: InMemoryKittenRepository;
  let useCase: LevelUpUseCase;
  let kitten: Kitten;
  let userId: string;

  beforeEach(() => {
    repository = new InMemoryKittenRepository();
    useCase = new LevelUpUseCase(repository);
    userId = 'user-1';
    
    kitten = kittenBuilder()
      .withId('kitten-1')
      .withName('Whiskers')
      .withUserId(userId)
      .withLevel(1)
      .withExperience(100)
      .withSkillPoints(0)
      .withStrength(5)
      .withAgility(5)
      .withConstitution(5)
      .withIntelligence(5)
      .withCreatedAt(new Date('2023-01-01'))
      .withUpdatedAt(new Date('2023-01-01'))
      .build();
      
    repository.save(kitten);
  });

  it('should increase kitten level and add skill points', async () => {
    // Given
    const defaultSkillPointsPerLevel = 5;
    
    // When
    const updatedKitten = await useCase.execute({
      kittenId: kitten.id,
      userId: userId
    });
    
    // Then
    expect(updatedKitten.level).toBe(kitten.level + 1);
    expect(updatedKitten.skillPoints).toBe(kitten.skillPoints + defaultSkillPointsPerLevel);
    
    // Verify kitten was saved
    const savedKitten = await repository.findById(kitten.id);
    expect(savedKitten?.level).toBe(kitten.level + 1);
    expect(savedKitten?.skillPoints).toBe(kitten.skillPoints + defaultSkillPointsPerLevel);
  });

  it('should increase kitten level with custom skill points', async () => {
    // Given
    const customSkillPointsPerLevel = 3;
    
    // When
    const updatedKitten = await useCase.execute({
      kittenId: kitten.id,
      userId: userId,
      skillPointsPerLevel: customSkillPointsPerLevel
    });
    
    // Then
    expect(updatedKitten.level).toBe(kitten.level + 1);
    expect(updatedKitten.skillPoints).toBe(kitten.skillPoints + customSkillPointsPerLevel);
  });

  it('should throw KittenNotFoundError when kitten does not exist', async () => {
    // Given
    const nonExistentKittenId = 'non-existent-id';
    
    // When & Then
    await expect(useCase.execute({
      kittenId: nonExistentKittenId,
      userId: userId
    })).rejects.toThrow(KittenNotFoundError);
  });

  it('should throw NotKittenOwnerError when user is not the owner', async () => {
    // Given
    const anotherUserId = 'another-user';
    
    // When & Then
    await expect(useCase.execute({
      kittenId: kitten.id,
      userId: anotherUserId
    })).rejects.toThrow(NotKittenOwnerError);
  });
});
