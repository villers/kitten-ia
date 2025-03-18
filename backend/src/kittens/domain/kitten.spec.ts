import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  describe('addExperience', () => {
    it('should add experience to the kitten', () => {
      // Given
      const initialExp = 100;
      const now = new Date('2023-01-01T12:00:00Z');
      const kitten = new Kitten(
        'kitten-1',
        KittenName.of('Whiskers'),
        'user-1',
        1,
        initialExp,
        0,
        KittenAttributes.createDefault(),
        now,
        now
      );
      const expToAdd = 50;
      
      // Mock Date constructor to return a different date
      const laterDate = new Date('2023-01-01T12:01:00Z');
      vi.spyOn(global, 'Date').mockImplementationOnce(() => laterDate);
      
      // When
      const updatedKitten = kitten.addExperience(expToAdd);
      
      // Then
      expect(updatedKitten.experience).toBe(initialExp + expToAdd);
      expect(updatedKitten.level).toBe(kitten.level); // Level should not change
      expect(updatedKitten.updatedAt.getTime()).toBeGreaterThan(kitten.updatedAt.getTime());
      
      // Restore Date mock
      vi.restoreAllMocks();
    });
  });

  describe('levelUp', () => {
    it('should increase level by 1 and add default skill points', () => {
      // Given
      const initialLevel = 3;
      const initialSkillPoints = 2;
      const now = new Date('2023-01-01T12:00:00Z');
      const kitten = new Kitten(
        'kitten-1',
        KittenName.of('Whiskers'),
        'user-1',
        initialLevel,
        100,
        initialSkillPoints,
        KittenAttributes.createDefault(),
        now,
        now
      );
      
      // Mock Date constructor to return a different date
      const laterDate = new Date('2023-01-01T12:01:00Z');
      vi.spyOn(global, 'Date').mockImplementationOnce(() => laterDate);
      
      // When
      const updatedKitten = kitten.levelUp();
      
      // Then
      expect(updatedKitten.level).toBe(initialLevel + 1);
      expect(updatedKitten.skillPoints).toBe(initialSkillPoints + 5); // Default is 5 points per level
      expect(updatedKitten.updatedAt.getTime()).toBeGreaterThan(kitten.updatedAt.getTime());
      
      // Restore Date mock
      vi.restoreAllMocks();
    });

    it('should increase level by 1 and add custom skill points', () => {
      // Given
      const initialLevel = 3;
      const initialSkillPoints = 2;
      const customSkillPointsPerLevel = 3;
      const now = new Date('2023-01-01T12:00:00Z');
      const kitten = new Kitten(
        'kitten-1',
        KittenName.of('Whiskers'),
        'user-1',
        initialLevel,
        100,
        initialSkillPoints,
        KittenAttributes.createDefault(),
        now,
        now
      );
      
      // Mock Date constructor to return a different date
      const laterDate = new Date('2023-01-01T12:01:00Z');
      vi.spyOn(global, 'Date').mockImplementationOnce(() => laterDate);
      
      // When
      const updatedKitten = kitten.levelUp(customSkillPointsPerLevel);
      
      // Then
      expect(updatedKitten.level).toBe(initialLevel + 1);
      expect(updatedKitten.skillPoints).toBe(initialSkillPoints + customSkillPointsPerLevel);
      
      // Restore Date mock
      vi.restoreAllMocks();
    });
  });

  describe('update', () => {
    let kitten: Kitten;
    let now: Date;
    
    beforeEach(() => {
      now = new Date('2023-01-01T12:00:00Z');
      kitten = new Kitten(
        'kitten-1',
        KittenName.of('Whiskers'),
        'user-1',
        1,
        0,
        0,
        KittenAttributes.createDefault(),
        now,
        now
      );
    });
    
    it('should update kitten name when provided', () => {
      // Given
      const newName = 'Fluffy';
      
      // Mock Date constructor to return a different date
      const laterDate = new Date('2023-01-01T12:01:00Z');
      vi.spyOn(global, 'Date').mockImplementationOnce(() => laterDate);
      
      // When
      const updatedKitten = kitten.update(newName);
      
      // Then
      expect(updatedKitten.name.toString()).toBe(newName);
      expect(updatedKitten.updatedAt.getTime()).toBeGreaterThan(kitten.updatedAt.getTime());
      
      // Restore Date mock
      vi.restoreAllMocks();
    });
    
    it('should update avatarUrl when provided', () => {
      // Given
      const newAvatarUrl = 'https://example.com/new-avatar.jpg';
      
      // Mock Date constructor to return a different date
      const laterDate = new Date('2023-01-01T12:01:00Z');
      vi.spyOn(global, 'Date').mockImplementationOnce(() => laterDate);
      
      // When
      const updatedKitten = kitten.update(undefined, newAvatarUrl);
      
      // Then
      expect(updatedKitten.avatarUrl).toBe(newAvatarUrl);
      expect(updatedKitten.name).toBe(kitten.name); // Name should not change
      
      // Restore Date mock
      vi.restoreAllMocks();
    });
    
    it('should update both name and avatarUrl when both provided', () => {
      // Given
      const newName = 'Fluffy';
      const newAvatarUrl = 'https://example.com/new-avatar.jpg';
      
      // Mock Date constructor to return a different date
      const laterDate = new Date('2023-01-01T12:01:00Z');
      vi.spyOn(global, 'Date').mockImplementationOnce(() => laterDate);
      
      // When
      const updatedKitten = kitten.update(newName, newAvatarUrl);
      
      // Then
      expect(updatedKitten.name.toString()).toBe(newName);
      expect(updatedKitten.avatarUrl).toBe(newAvatarUrl);
      
      // Restore Date mock
      vi.restoreAllMocks();
    });
    
    it('should set avatarUrl to null when explicitly set to null', () => {
      // Given
      const initialAvatarUrl = 'https://example.com/avatar.jpg';
      const createdAt = new Date('2023-01-01T12:00:00Z');
      const updatedAt = new Date('2023-01-01T12:00:00Z');
      const kittenWithAvatar = new Kitten(
        'kitten-1',
        KittenName.of('Whiskers'),
        'user-1',
        1,
        0,
        0,
        KittenAttributes.createDefault(),
        createdAt,
        updatedAt,
        initialAvatarUrl
      );
      
      // Mock Date constructor to return a different date
      const laterDate = new Date('2023-01-01T12:01:00Z');
      vi.spyOn(global, 'Date').mockImplementationOnce(() => laterDate);
      
      // When
      const updatedKitten = kittenWithAvatar.update(undefined, null);
      
      // Then
      expect(updatedKitten.avatarUrl).toBeNull();
      
      // Restore Date mock
      vi.restoreAllMocks();
    });
  });
});
