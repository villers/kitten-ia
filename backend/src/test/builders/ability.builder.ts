import { Ability } from '@prisma/client';
import { kittenBuilder } from './kitten.builder';
import { AbilityType } from '../constants/enums';

interface AbilityOptions {
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

export const abilityBuilder = ({
  id = 'ability-id-1',
  name = 'Scratch',
  description = 'A basic scratch attack',
  type = AbilityType.ATTACK,
  power = 10,
  accuracy = 90,
  cooldown = 0,
  kittenId = kittenBuilder().build().id,
  createdAt = new Date(),
  updatedAt = new Date(),
}: AbilityOptions = {}) => {
  const props = {
    id,
    name,
    description,
    type,
    power,
    accuracy,
    cooldown,
    kittenId,
    createdAt,
    updatedAt,
  };

  return {
    withId(_id: string) {
      return abilityBuilder({ ...props, id: _id });
    },

    withName(_name: string) {
      return abilityBuilder({ ...props, name: _name });
    },

    withDescription(_description: string) {
      return abilityBuilder({ ...props, description: _description });
    },

    withType(_type: AbilityType) {
      return abilityBuilder({ ...props, type: _type });
    },

    withPower(_power: number) {
      return abilityBuilder({ ...props, power: _power });
    },

    withAccuracy(_accuracy: number) {
      return abilityBuilder({ ...props, accuracy: _accuracy });
    },

    withCooldown(_cooldown: number) {
      return abilityBuilder({ ...props, cooldown: _cooldown });
    },

    withKittenId(_kittenId: string) {
      return abilityBuilder({ ...props, kittenId: _kittenId });
    },

    withCreatedAt(_createdAt: Date) {
      return abilityBuilder({ ...props, createdAt: _createdAt });
    },

    withUpdatedAt(_updatedAt: Date) {
      return abilityBuilder({ ...props, updatedAt: _updatedAt });
    },

    build(): Ability {
      return {
        id: props.id,
        name: props.name,
        description: props.description,
        type: props.type as any, // Type casting pour éviter les problèmes de compatibilité
        power: props.power,
        accuracy: props.accuracy,
        cooldown: props.cooldown,
        kittenId: props.kittenId,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      };
    },
  };
};
