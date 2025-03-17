import { describe, it, expect, beforeEach } from 'vitest';
import { CreateKittenUseCase } from '../../application/usecases/create-kitten.usecase';
import { KittenFixture, createKittenFixture } from '../kitten-fixture';
import { KittenNameAlreadyExistError, UserNotFoundForKittenCreationError } from '../../domain/errors';
import { kittenBuilder } from '../kitten-builder';
import { Kitten } from '../../domain/kitten';

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
    const result = await createKittenUseCase.execute({
      name: 'Whiskers',
      strength: 7,
      agility: 6,
      constitution: 8,
      intelligence: 5,
      userId
    });

    // Then
    expect(result).toBeInstanceOf(Kitten);
    expect(result.name.value).toBe('Whiskers');
    expect(result.userId).toBe(userId);
    expect(result.attributes.strength.value).toBe(7);
    expect(result.attributes.agility.value).toBe(6);
    expect(result.attributes.constitution.value).toBe(8);
    expect(result.attributes.intelligence.value).toBe(5);
    expect(result.level).toBe(1);
    expect(result.experience).toBe(0);
    expect(result.skillPoints).toBe(0);
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
    const result = await createKittenUseCase.execute({
      name: 'Whiskers',
      userId
    });

    // Then
    expect(result).toBeInstanceOf(Kitten);
    expect(result.name.value).toBe('Whiskers');
    expect(result.userId).toBe(userId);
    expect(result.attributes.strength.value).toBe(5);
    expect(result.attributes.agility.value).toBe(5);
    expect(result.attributes.constitution.value).toBe(5);
    expect(result.attributes.intelligence.value).toBe(5);
  });

  it('should throw an error if user does not exist', async () => {
    // When
    try {
      await createKittenUseCase.execute({
        name: 'Whiskers',
        userId: 'non-existent-user'
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Then
      expect(error).toBeInstanceOf(UserNotFoundForKittenCreationError);
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
      await createKittenUseCase.execute({
        name: 'Whiskers',
        userId
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Then
      expect(error).toBeInstanceOf(KittenNameAlreadyExistError);
    }
  });
});
