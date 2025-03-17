import { describe, it, expect } from 'vitest';
import { KittenAttributes } from './kitten-attributes';
import { AttributeValue } from './attribute-value';

describe('KittenAttributes', () => {
  it('should create kitten attributes with default values', () => {
    // When
    const attributes = KittenAttributes.createDefault();
    
    // Then
    expect(attributes.strength.value).toBe(5);
    expect(attributes.agility.value).toBe(5);
    expect(attributes.constitution.value).toBe(5);
    expect(attributes.intelligence.value).toBe(5);
  });

  it('should create kitten attributes with provided values', () => {
    // Given
    const strength = AttributeValue.of(7);
    const agility = AttributeValue.of(8);
    const constitution = AttributeValue.of(6);
    const intelligence = AttributeValue.of(9);
    
    // When
    const attributes = new KittenAttributes(
      strength,
      agility,
      constitution,
      intelligence
    );
    
    // Then
    expect(attributes.strength).toBe(strength);
    expect(attributes.agility).toBe(agility);
    expect(attributes.constitution).toBe(constitution);
    expect(attributes.intelligence).toBe(intelligence);
  });

  it('should calculate HP properly based on constitution', () => {
    // Given
    const constitution = AttributeValue.of(8);
    const attributes = new KittenAttributes(
      AttributeValue.of(5),
      AttributeValue.of(5),
      constitution,
      AttributeValue.of(5)
    );
    const level = 3;
    
    // When
    const hp = attributes.calculateHP(level);
    
    // Then
    // HP formula: BASE_HP + (constitution * CON_MULTIPLIER) + (level * LEVEL_MULTIPLIER)
    const BASE_HP = 50;
    const CON_MULTIPLIER = 8;
    const LEVEL_MULTIPLIER = 5;
    const expectedHP = BASE_HP + (constitution.value * CON_MULTIPLIER) + (level * LEVEL_MULTIPLIER);
    expect(hp).toBe(expectedHP);
  });

  it('should add skill points to attributes', () => {
    // Given
    const attributes = KittenAttributes.createDefault();
    
    // When
    const updatedAttributes = attributes.addSkillPoints(2, 3, 1, 4);
    
    // Then
    expect(updatedAttributes.strength.value).toBe(7);
    expect(updatedAttributes.agility.value).toBe(8);
    expect(updatedAttributes.constitution.value).toBe(6);
    expect(updatedAttributes.intelligence.value).toBe(9);
  });

  it('should validate if there are enough skill points', () => {
    // Given
    const skillPoints = 5;
    
    // When & Then
    expect(KittenAttributes.validateSkillPoints(skillPoints, 2, 1, 1, 1)).toBe(true);
    expect(KittenAttributes.validateSkillPoints(skillPoints, 2, 2, 1, 0)).toBe(true);
    expect(KittenAttributes.validateSkillPoints(skillPoints, 1, 1, 1, 2)).toBe(true);
    expect(KittenAttributes.validateSkillPoints(skillPoints, 5, 0, 0, 0)).toBe(true);
    expect(KittenAttributes.validateSkillPoints(skillPoints, 6, 0, 0, 0)).toBe(false);
    expect(KittenAttributes.validateSkillPoints(skillPoints, 2, 2, 2, 2)).toBe(false);
  });
});
