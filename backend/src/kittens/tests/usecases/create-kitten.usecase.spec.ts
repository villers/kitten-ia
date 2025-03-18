import { describe, it, expect, beforeEach } from 'vitest';
import { CreateKittenUseCase } from '@/kittens/application/usecases/create-kitten.usecase';
import { KittenFixture, createKittenFixture } from '@/kittens/tests/kitten-fixture';
import { KittenNameAlreadyExistError, UserNotFoundForKittenCreationError } from '@/kittens/domain/errors';
import { kittenBuilder } from '@/kittens/tests/kitten-builder';
import { Kitten } from '@/kittens/domain/kitten';

describe('Create Kitten Use Case', () => {
  let fixture: KittenFixture;
  let createKittenUseCase: CreateKittenUseCase;

  beforeEach(() => {
    fixture = createKittenFixture();
    fixture.givenCurrentDate(new Date('2024-01-01T00:00:00Z'));
    createKittenUseCase = new CreateKittenUseCase(
      fixture.getKittenRepository(),
      fixture.getUserRepository()
    );
    createKittenUseCase.setDateProvider(() => fixture.getCurrentDate());
  });

  it('should create a kitten with valid data', async () => {
    // Given
    const userId = 'user-1';
    const user = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com'
    };

    fixture.givenUserExists([user]);

    // When
    try {
      const result = await createKittenUseCase.execute({
        name: 'Whiskers',
        strength: 7,
        agility: 6,
        constitution: 8,
        intelligence: 5,
        userId
      });
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    fixture.thenResultShouldBeInstanceOf(Kitten);
    fixture.thenKittenShouldMatchProperties({
      name: { value: 'Whiskers' },
      userId: userId,
      attributes: {
        strength: { value: 7 },
        agility: { value: 6 },
        constitution: { value: 8 },
        intelligence: { value: 5 }
      },
      level: 1,
      experience: 0,
      skillPoints: 0
    });
  });

  it('should create a kitten with default attributes if not provided', async () => {
    // Given
    const userId = 'user-1';
    const user = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com'
    };

    fixture.givenUserExists([user]);

    // When
    try {
      const result = await createKittenUseCase.execute({
        name: 'Whiskers',
        userId
      });
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    fixture.thenResultShouldBeInstanceOf(Kitten);
    fixture.thenKittenShouldMatchProperties({
      name: { value: 'Whiskers' },
      userId: userId,
      attributes: {
        strength: { value: 5 },
        agility: { value: 5 },
        constitution: { value: 5 },
        intelligence: { value: 5 }
      }
    });
  });

  it('should throw an error if user does not exist', async () => {
    // When
    try {
      const result = await createKittenUseCase.execute({
        name: 'Whiskers',
        userId: 'non-existent-user'
      });
      fixture.setResult(result);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      fixture.setError(error as Error);
      // Then
      fixture.thenErrorShouldBeInstanceOf(UserNotFoundForKittenCreationError);
    }
  });

  it('should throw an error if kitten name already exists for the user', async () => {
    // Given
    const userId = 'user-1';
    const user = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com'
    };

    const existingKitten = kittenBuilder()
      .withName('Whiskers')
      .withUserId(userId)
      .build();

    fixture.givenUserExists([user]);
    fixture.givenKittenExists([existingKitten]);

    // When
    try {
      const result = await createKittenUseCase.execute({
        name: 'Whiskers',
        userId
      });
      fixture.setResult(result);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      fixture.setError(error as Error);
      // Then
      fixture.thenErrorShouldBeInstanceOf(KittenNameAlreadyExistError);
    }
  });
});
