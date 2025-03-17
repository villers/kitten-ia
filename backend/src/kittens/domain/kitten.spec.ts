import { describe, it, expect } from 'vitest';
import { Kitten } from './kitten';
import { KittenName } from './kitten-name';
import { KittenAttributes } from './kitten-attributes';
import { AttributeValue } from './attribute-value';
import { NotEnoughSkillPointsError } from './errors';

describe('Kitten', () => {
  it('should create a kitten with valid data', () => {
    // Given
    const id = 'kitten-1';
    const name = KittenName.of('Whiskers');
    const userId = 'user-1';
    const level = 1;
    const experience = 0;
    const skillPoints = 5;
    const attributes = KittenAttributes.createDefault();
    const createdAt = new Date('2024-01-01');
    const updatedAt = new Date('2024-01-01');
    
    // When
    const kitten = new Kitten(
      id,
      name,
      userId,
      level,
      experience,
      skillPoints,
      attributes,
      createdAt,
      updatedAt
    );
    
    // Then
    expect(kitten.id).toBe(id);
    expect(kitten.name).toBe(name);
    expect(kitten.userId).toBe(userId);
    expect(kitten.level).toBe(level);
    expect(kitten.experience).toBe(experience);
    expect(kitten.skillPoints).toBe(skillPoints);
    expect(kitten.attributes).toBe(attributes);
    expect(kitten.createdAt).toBe(createdAt);
    expect(kitten.updatedAt).toBe(updatedAt);
  });

  it('should calculate HP based on constitution and level', () => {
    // Given
    const kitten = new Kitten(
      'kitten-1',
      KittenName.of('Whiskers'),
      'user-1',
      3,
      0,
      0,
      new KittenAttributes(
        AttributeValue.of(5),
        AttributeValue.of(5),
        AttributeValue.of(8),
        AttributeValue.of(5)
      ),
      new Date(),
      new Date()
    );
    
    // When
    const hp = kitten.getHP();
    
    // Then
    // HP formula from KittenAttributes: BASE_HP(50) + (constitution(8) * CON_MULTIPLIER(8)) + (level(3) * LEVEL_MULTIPLIER(5))
    const expectedHP = 50 + (8 * 8) + (3 * 5);
    expect(hp).toBe(expectedHP);
  });

  it('should allow assigning skill points if enough are available', () => {
    // Given
    const kitten = new Kitten(
      'kitten-1',
      KittenName.of('Whiskers'),
      'user-1',
      1,
      0,
      10,
      KittenAttributes.createDefault(),
      new Date(),
      new Date()
    );
    
    // When
    const updatedKitten = kitten.assignSkillPoints(2, 3, 1, 4);
    
    // Then
    expect(updatedKitten.attributes.strength.value).toBe(7);
    expect(updatedKitten.attributes.agility.value).toBe(8);
    expect(updatedKitten.attributes.constitution.value).toBe(6);
    expect(updatedKitten.attributes.intelligence.value).toBe(9);
    expect(updatedKitten.skillPoints).toBe(0);
  });

  it('should throw an error when not enough skill points are available', () => {
    // Given
    const kitten = new Kitten(
      'kitten-1',
      KittenName.of('Whiskers'),
      'user-1',
      1,
      0,
      5,
      KittenAttributes.createDefault(),
      new Date(),
      new Date()
    );
    
    // When & Then
    expect(() => kitten.assignSkillPoints(2, 3, 1, 4)).toThrow(NotEnoughSkillPointsError);
  });

  it('should validate if user is the owner', () => {
    // Given
    const userId = 'user-1';
    const kitten = new Kitten(
      'kitten-1',
      KittenName.of('Whiskers'),
      userId,
      1,
      0,
      0,
      KittenAttributes.createDefault(),
      new Date(),
      new Date()
    );
    
    // When & Then
    expect(kitten.isOwnedBy(userId)).toBe(true);
    expect(kitten.isOwnedBy('other-user')).toBe(false);
  });
});
