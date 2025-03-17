import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kitten } from '../../domain/kitten';
import { KittenName } from '../../domain/kitten-name';
import { KittenAttributes } from '../../domain/kitten-attributes';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';
import { InMemoryKittenRepository } from '../in-memory-kitten-repository';
import { UpdateKittenUseCase } from '../../application/usecases/update-kitten.usecase';
import { kittenBuilder } from '../kitten-builder';

describe('UpdateKittenUseCase', () => {
  let repository: InMemoryKittenRepository;
  let useCase: UpdateKittenUseCase;
  let kitten: Kitten;
  let userId: string;

  beforeEach(() => {
    repository = new InMemoryKittenRepository();
    useCase = new UpdateKittenUseCase(repository);
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

  it('should update kitten name', async () => {
    // Given
    const newName = 'Fluffy';
    
    // When
    const updatedKitten = await useCase.execute({
      kittenId: kitten.id,
      userId: userId,
      name: newName
    });
    
    // Then
    expect(updatedKitten.name.toString()).toBe(newName);
    expect(updatedKitten.avatarUrl).toBe(kitten.avatarUrl);
    
    // Verify kitten was saved
    const savedKitten = await repository.findById(kitten.id);
    expect(savedKitten?.name.toString()).toBe(newName);
  });

  it('should update kitten avatarUrl', async () => {
    // Given
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    
    // When
    const updatedKitten = await useCase.execute({
      kittenId: kitten.id,
      userId: userId,
      avatarUrl: newAvatarUrl
    });
    
    // Then
    expect(updatedKitten.name).toEqual(kitten.name);
    expect(updatedKitten.avatarUrl).toBe(newAvatarUrl);
    
    // Verify kitten was saved
    const savedKitten = await repository.findById(kitten.id);
    expect(savedKitten?.avatarUrl).toBe(newAvatarUrl);
  });

  it('should update both name and avatarUrl', async () => {
    // Given
    const newName = 'Fluffy';
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    
    // When
    const updatedKitten = await useCase.execute({
      kittenId: kitten.id,
      userId: userId,
      name: newName,
      avatarUrl: newAvatarUrl
    });
    
    // Then
    expect(updatedKitten.name.toString()).toBe(newName);
    expect(updatedKitten.avatarUrl).toBe(newAvatarUrl);
  });

  it('should throw KittenNotFoundError when kitten does not exist', async () => {
    // Given
    const nonExistentKittenId = 'non-existent-id';
    
    // When & Then
    await expect(useCase.execute({
      kittenId: nonExistentKittenId,
      userId: userId,
      name: 'New Name'
    })).rejects.toThrow(KittenNotFoundError);
  });

  it('should throw NotKittenOwnerError when user is not the owner', async () => {
    // Given
    const anotherUserId = 'another-user';
    
    // When & Then
    await expect(useCase.execute({
      kittenId: kitten.id,
      userId: anotherUserId,
      name: 'New Name'
    })).rejects.toThrow(NotKittenOwnerError);
  });

  it('should throw error when neither name nor avatarUrl is provided', async () => {
    // When & Then
    await expect(useCase.execute({
      kittenId: kitten.id,
      userId: userId
    })).rejects.toThrow('At least one of name or avatarUrl must be provided');
  });

  it('should set avatarUrl to null when explicitly set to null', async () => {
    // Given
    const kittenWithAvatar = kittenBuilder()
      .withId('kitten-with-avatar')
      .withName('WithAvatar')
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
      .withAvatarUrl('https://example.com/avatar.jpg')
      .build();
      
    repository.save(kittenWithAvatar);
    
    // When
    const updatedKitten = await useCase.execute({
      kittenId: kittenWithAvatar.id,
      userId: userId,
      avatarUrl: null
    });
    
    // Then
    expect(updatedKitten.avatarUrl).toBeNull();
  });
});
