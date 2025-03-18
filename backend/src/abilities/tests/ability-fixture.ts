import { AbilityType } from '@prisma/client';
import { Ability } from '@/abilities/domain/ability';
import { abilityBuilder } from '@/abilities/tests/ability-builder';
import { InMemoryAbilityRepository } from '@/abilities/tests/in-memory-ability-repository';
import { InMemoryKittenRepository } from '@/abilities/tests/in-memory-kitten-repository';

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
}

export function createAbilityFixture(): AbilityFixture {
  const abilityRepository = new InMemoryAbilityRepository();
  const kittenRepository = new InMemoryKittenRepository();
  let currentDate = new Date();

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
    }
  };
}
