import { AbilityType } from '@prisma/client';
import { Ability } from '@/abilities/domain/ability';

interface AbilityBuilderOptions {
  id?: string;
  name?: string;
  description?: string;
  type?: AbilityType;
  power?: number;
  accuracy?: number;
  cooldown?: number;
  kittenId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const abilityBuilder = (options: AbilityBuilderOptions = {}) => {
  const props = {
    id: options.id ?? 'ability-id-1',
    name: options.name ?? 'Test Ability',
    description: options.description ?? 'Test ability description',
    type: options.type ?? AbilityType.ATTACK,
    power: options.power ?? 30,
    accuracy: options.accuracy ?? 90,
    cooldown: options.cooldown ?? 2,
    kittenId: options.kittenId ?? 'kitten-id-1',
    createdAt: options.createdAt || new Date('2024-01-01T00:00:00Z'),
    updatedAt: options.updatedAt || new Date('2024-01-01T00:00:00Z'),
  };

  return {
    withId(id: string) {
      return abilityBuilder({ ...options, id });
    },

    withName(name: string) {
      return abilityBuilder({ ...options, name });
    },

    withDescription(description: string) {
      return abilityBuilder({ ...options, description });
    },

    withType(type: AbilityType) {
      return abilityBuilder({ ...options, type });
    },

    withPower(power: number) {
      return abilityBuilder({ ...options, power });
    },

    withAccuracy(accuracy: number) {
      return abilityBuilder({ ...options, accuracy });
    },

    withCooldown(cooldown: number) {
      return abilityBuilder({ ...options, cooldown });
    },

    withKittenId(kittenId: string) {
      return abilityBuilder({ ...options, kittenId });
    },

    withCreatedAt(createdAt: Date) {
      return abilityBuilder({ ...options, createdAt });
    },

    withUpdatedAt(updatedAt: Date) {
      return abilityBuilder({ ...options, updatedAt });
    },

    build(): Ability {
      return new Ability(
        props.id,
        props.name,
        props.description,
        props.type,
        props.power,
        props.accuracy,
        props.cooldown,
        props.kittenId,
        props.createdAt,
        props.updatedAt
      );
    }
  };
};
