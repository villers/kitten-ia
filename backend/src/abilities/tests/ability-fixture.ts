import { AbilityType } from '@prisma/client';
import { Ability } from '@/abilities/domain/ability';
import { abilityBuilder } from '@/abilities/tests/ability-builder';
import { InMemoryAbilityRepository } from '@/abilities/tests/in-memory-ability-repository';
import { InMemoryKittenRepository } from '@/abilities/tests/in-memory-kitten-repository';
import { expect } from 'vitest';

export interface AbilityFixture {
  getAbilityRepository(): InMemoryAbilityRepository;
  getKittenRepository(): InMemoryKittenRepository;
  getCurrentDate(): Date;
  givenCurrentDate(date: Date): void;
  givenKittenExists(kittens: Array<{ id: string, userId: string }>): void;
  givenAbilityExists(abilities: Ability[]): void;
  createDefaultAbility(
    overrides?: Partial<{
      id: string;
      name: string;
      description: string;
      type: AbilityType;
      power: number;
      accuracy: number;
      cooldown: number;
      kittenId: string;
    }>
  ): Ability;
  
  // Result and error handling
  getResult(): any;
  setResult(result: any): void;
  getError(): Error | null;
  setError(error: Error): void;
  
  // Then assertions
  thenResultShouldBeArray(): void;
  thenResultShouldHaveLength(length: number): void;
  thenResultShouldContainItemWithProperty(property: string, value: any): void;
  thenAllResultItemsShouldHaveProperty(property: string, value: any): void;
  thenErrorShouldBeInstanceOf(errorClass: new (...args: any[]) => Error): void;
  thenErrorMessageShouldContain(text: string): void;
}

export function createAbilityFixture(): AbilityFixture {
  const abilityRepository = new InMemoryAbilityRepository();
  const kittenRepository = new InMemoryKittenRepository();
  let currentDate = new Date();
  let result: any = null;
  let error: Error | null = null;

  return {
    getAbilityRepository(): InMemoryAbilityRepository {
      return abilityRepository;
    },

    getKittenRepository(): InMemoryKittenRepository {
      return kittenRepository;
    },

    getCurrentDate(): Date {
      return currentDate;
    },

    givenCurrentDate(date: Date): void {
      currentDate = date;
    },

    givenKittenExists(kittens: Array<{ id: string, userId: string }>): void {
      kittenRepository.clear();
      kittens.forEach(kitten => kittenRepository.addKitten(kitten));
    },

    givenAbilityExists(abilities: Ability[]): void {
      abilityRepository.clear();
      abilities.forEach(ability => abilityRepository.addAbility(ability));
    },

    createDefaultAbility(overrides = {}): Ability {
      const builder = abilityBuilder()
        .withId(overrides.id ?? 'ability-1')
        .withName(overrides.name ?? 'Test Ability')
        .withDescription(overrides.description ?? 'Test ability description')
        .withType(overrides.type ?? AbilityType.ATTACK)
        .withPower(overrides.power ?? 30)
        .withAccuracy(overrides.accuracy ?? 90)
        .withCooldown(overrides.cooldown ?? 2)
        .withKittenId(overrides.kittenId ?? 'kitten-1')
        .withCreatedAt(currentDate)
        .withUpdatedAt(currentDate);

      return builder.build();
    },
    
    // Result and error handling
    getResult(): any {
      return result;
    },
    
    setResult(newResult: any): void {
      result = newResult;
    },
    
    getError(): Error | null {
      return error;
    },
    
    setError(newError: Error): void {
      error = newError;
    },
    
    // Then assertions
    thenResultShouldBeArray(): void {
      expect(Array.isArray(result)).toBe(true);
    },
    
    thenResultShouldHaveLength(length: number): void {
      expect(result).toHaveLength(length);
    },
    
    thenResultShouldContainItemWithProperty(property: string, value: any): void {
      expect(result.some((item: any) => item[property] === value)).toBe(true);
    },
    
    thenAllResultItemsShouldHaveProperty(property: string, value: any): void {
      expect(result.every((item: any) => item[property] === value)).toBe(true);
    },
    
    thenErrorShouldBeInstanceOf(errorClass: new (...args: any[]) => Error): void {
      expect(error).toBeInstanceOf(errorClass);
    },
    
    thenErrorMessageShouldContain(text: string): void {
      expect(error?.message).toContain(text);
    }
  };
}
