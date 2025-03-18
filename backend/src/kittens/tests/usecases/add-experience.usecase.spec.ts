import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kitten } from '@/kittens/domain/kitten';
import { KittenNotFoundError, NotKittenOwnerError } from '@/kittens/domain/errors';
import { InMemoryKittenRepository } from '@/kittens/tests/in-memory-kitten-repository';
import { AddExperienceUseCase } from '@/kittens/application/usecases/add-experience.usecase';
import { kittenBuilder } from '@/kittens/tests/kitten-builder';

describe('AddExperienceUseCase', () => {
  let repository: InMemoryKittenRepository;
  let useCase: AddExperienceUseCase;
  let kitten: Kitten;
  let userId: string;

  beforeEach(() => {
    repository = new InMemoryKittenRepository();
    useCase = new AddExperienceUseCase(repository);
    userId = 'user-1';
    
    kitten = kittenBuilder()
      .withId('kitten-1')
      .withName('Whiskers')
      .withUserId(userId)
      .withLevel(1)
      .withExperience(0)
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

  it('should add experience to kitten', async () => {
    // Given
    const experienceToAdd = 50;
    
    // When
    const updatedKitten = await useCase.execute({
      kittenId: kitten.id,
      userId: userId,
      experience: experienceToAdd
    });
    
    // Then
    expect(updatedKitten.experience).toBe(kitten.experience + experienceToAdd);
    expect(updatedKitten.level).toBe(kitten.level); // Level should not change
    
    // Verify kitten was saved
    const savedKitten = await repository.findById(kitten.id);
    expect(savedKitten?.experience).toBe(kitten.experience + experienceToAdd);
  });

  it('should throw KittenNotFoundError when kitten does not exist', async () => {
    // Given
    const nonExistentKittenId = 'non-existent-id';
    
    // When & Then
    await expect(useCase.execute({
      kittenId: nonExistentKittenId,
      userId: userId,
      experience: 50
    })).rejects.toThrow(KittenNotFoundError);
  });

  it('should throw NotKittenOwnerError when user is not the owner', async () => {
    // Given
    const anotherUserId = 'another-user';
    
    // When & Then
    await expect(useCase.execute({
      kittenId: kitten.id,
      userId: anotherUserId,
      experience: 50
    })).rejects.toThrow(NotKittenOwnerError);
  });

  it('should throw error when negative experience is provided', async () => {
    // Given
    const negativeExperience = -10;
    
    // When & Then
    await expect(useCase.execute({
      kittenId: kitten.id,
      userId: userId,
      experience: negativeExperience
    })).rejects.toThrow('Experience must be a positive number');
  });
});
