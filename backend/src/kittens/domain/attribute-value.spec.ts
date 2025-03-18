import { describe, it, expect } from 'vitest';
import { AttributeValue } from '@/kittens/domain/attribute-value';

describe('AttributeValue', () => {
  it('should create a valid attribute value', () => {
    // Given
    const value = 5;
    
    // When
    const attributeValue = AttributeValue.of(value);
    
    // Then
    expect(attributeValue.value).toBe(value);
  });

  it('should not allow values below minimum', () => {
    // Given
    const invalidValue = 0;
    
    // When & Then
    expect(() => AttributeValue.of(invalidValue)).toThrow('Attribute value must be between 1 and 20');
  });

  it('should not allow values above maximum', () => {
    // Given
    const invalidValue = 21;
    
    // When & Then
    expect(() => AttributeValue.of(invalidValue)).toThrow('Attribute value must be between 1 and 20');
  });

  it('should allow values at minimum boundary', () => {
    // Given
    const minValue = 1;
    
    // When
    const attributeValue = AttributeValue.of(minValue);
    
    // Then
    expect(attributeValue.value).toBe(minValue);
  });

  it('should allow values at maximum boundary', () => {
    // Given
    const maxValue = 20;
    
    // When
    const attributeValue = AttributeValue.of(maxValue);
    
    // Then
    expect(attributeValue.value).toBe(maxValue);
  });

  it('should convert non-integer values to integers', () => {
    // Given
    const floatValue = 5.7;
    
    // When
    const attributeValue = AttributeValue.of(floatValue);
    
    // Then
    expect(attributeValue.value).toBe(5);
    expect(Number.isInteger(attributeValue.value)).toBe(true);
  });
});
