import { describe, it, expect } from 'vitest';
import { KittenName } from './kitten-name';
import { KittenNameTooShortError, KittenNameTooLongError } from './errors';

describe('KittenName', () => {
  it('should create a valid kitten name', () => {
    // Given
    const validName = 'Whiskers';
    
    // When
    const kittenName = KittenName.of(validName);
    
    // Then
    expect(kittenName.value).toBe(validName);
  });

  it('should throw an error if the name is too short', () => {
    // Given
    const tooShortName = 'Wi';
    
    // When & Then
    expect(() => KittenName.of(tooShortName)).toThrow(KittenNameTooShortError);
  });

  it('should throw an error if the name is too long', () => {
    // Given
    const tooLongName = 'WhiskersTheCatWithTheExtremelyLongName';
    
    // When & Then
    expect(() => KittenName.of(tooLongName)).toThrow(KittenNameTooLongError);
  });

  it('should trim the name', () => {
    // Given
    const nameWithSpaces = '  Whiskers  ';
    
    // When
    const kittenName = KittenName.of(nameWithSpaces);
    
    // Then
    expect(kittenName.value).toBe('Whiskers');
  });

  it('should convert to string properly', () => {
    // Given
    const name = 'Whiskers';
    const kittenName = KittenName.of(name);
    
    // When
    const result = kittenName.toString();
    
    // Then
    expect(result).toBe(name);
  });
});
