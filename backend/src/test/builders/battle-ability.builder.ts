import { BattleAbility } from '@/battles/domain/battle-kitten';

interface BattleAbilityOptions {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  power?: number;
  accuracy?: number;
  cooldown?: number;
  currentCooldown?: number;
}

export const battleAbilityBuilder = ({
  id = 'battle-ability-id-1',
  name = 'Test Ability',
  description = 'A test ability for battles',
  type = 'ATTACK',
  power = 10,
  accuracy = 90,
  cooldown = 0,
  currentCooldown = 0,
}: BattleAbilityOptions = {}) => {
  const props = {
    id,
    name,
    description,
    type,
    power,
    accuracy,
    cooldown,
    currentCooldown,
  };

  return {
    withId(_id: string) {
      return battleAbilityBuilder({ ...props, id: _id });
    },

    withName(_name: string) {
      return battleAbilityBuilder({ ...props, name: _name });
    },

    withDescription(_description: string) {
      return battleAbilityBuilder({ ...props, description: _description });
    },

    withType(_type: string) {
      return battleAbilityBuilder({ ...props, type: _type });
    },

    withPower(_power: number) {
      return battleAbilityBuilder({ ...props, power: _power });
    },

    withAccuracy(_accuracy: number) {
      return battleAbilityBuilder({ ...props, accuracy: _accuracy });
    },

    withCooldown(_cooldown: number) {
      return battleAbilityBuilder({ ...props, cooldown: _cooldown });
    },

    withCurrentCooldown(_currentCooldown: number) {
      return battleAbilityBuilder({ ...props, currentCooldown: _currentCooldown });
    },

    build(): BattleAbility {
      return BattleAbility.create(
        props.id,
        props.name,
        props.description,
        props.type,
        props.power,
        props.accuracy,
        props.cooldown,
        props.currentCooldown
      );
    },
  };
};