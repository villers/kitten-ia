import { describe, it, expect, beforeEach } from 'vitest';
import { Kitten } from '@/kittens/domain/kitten';
import { KittenNotFoundError, NotKittenOwnerError } from '@/kittens/domain/errors';
import { UpdateKittenUseCase } from '@/kittens/application/usecases/update-kitten.usecase';
import { kittenBuilder } from '@/kittens/tests/kitten-builder';
import { KittenFixture, createKittenFixture } from '@/kittens/tests/kitten-fixture';

describe('UpdateKittenUseCase', () => {
  let fixture: KittenFixture;
  let useCase: UpdateKittenUseCase;
  let kitten: Kitten;
  let userId: string;

  beforeEach(() => {
    fixture = createKittenFixture();
    useCase = new UpdateKittenUseCase(fixture.getKittenRepository());
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
      
    fixture.givenKittenExists([kitten]);
  });

  it('should update kitten name', async () => {
    // Given
    const newName = 'Fluffy';
    
    // When
    try {
      const updatedKitten = await useCase.execute({
        kittenId: kitten.id,
        userId: userId,
        name: newName
      });
      fixture.setResult(updatedKitten);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    fixture.thenKittenShouldMatchProperties({
      name: { value: newName },
      avatarUrl: kitten.avatarUrl
    });
    
    // Verify kitten was saved
    const savedKitten = await fixture.getKittenRepository().findById(kitten.id);
    expect(savedKitten?.name.toString()).toBe(newName);
  });

  it('should update kitten avatarUrl', async () => {
    // Given
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    
    // When
    try {
      const updatedKitten = await useCase.execute({
        kittenId: kitten.id,
        userId: userId,
        avatarUrl: newAvatarUrl
      });
      fixture.setResult(updatedKitten);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    fixture.thenKittenShouldMatchProperties({
      avatarUrl: newAvatarUrl
    });
    
    // Verify kitten was saved
    const savedKitten = await fixture.getKittenRepository().findById(kitten.id);
    expect(savedKitten?.avatarUrl).toBe(newAvatarUrl);
  });

  it('should update both name and avatarUrl', async () => {
    // Given
    const newName = 'Fluffy';
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    
    // When
    try {
      const updatedKitten = await useCase.execute({
        kittenId: kitten.id,
        userId: userId,
        name: newName,
        avatarUrl: newAvatarUrl
      });
      fixture.setResult(updatedKitten);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    fixture.thenKittenShouldMatchProperties({
      name: { value: newName },
      avatarUrl: newAvatarUrl
    });
  });

  it('should throw KittenNotFoundError when kitten does not exist', async () => {
    // Given
    const nonExistentKittenId = 'non-existent-id';
    
    // When
    try {
      const result = await useCase.execute({
        kittenId: nonExistentKittenId,
        userId: userId,
        name: 'New Name'
      });
      fixture.setResult(result);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    fixture.thenErrorShouldBeInstanceOf(KittenNotFoundError);
  });

  it('should throw NotKittenOwnerError when user is not the owner', async () => {
    // Given
    const anotherUserId = 'another-user';
    
    // When
    try {
      const result = await useCase.execute({
        kittenId: kitten.id,
        userId: anotherUserId,
        name: 'New Name'
      });
      fixture.setResult(result);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    fixture.thenErrorShouldBeInstanceOf(NotKittenOwnerError);
  });

  it('should throw error when neither name nor avatarUrl is provided', async () => {
    // When
    try {
      const result = await useCase.execute({
        kittenId: kitten.id,
        userId: userId
      });
      fixture.setResult(result);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    fixture.thenErrorMessageShouldContain('At least one of name or avatarUrl must be provided');
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
      
    fixture.givenKittenExists([kittenWithAvatar]);
    
    // When
    try {
      const updatedKitten = await useCase.execute({
        kittenId: kittenWithAvatar.id,
        userId: userId,
        avatarUrl: null
      });
      fixture.setResult(updatedKitten);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    fixture.thenKittenShouldMatchProperties({
      avatarUrl: null
    });
  });
});
