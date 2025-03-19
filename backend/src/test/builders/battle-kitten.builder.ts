import { BattleKitten, BattleAbility } from '@/battles/domain/battle-kitten';
import { battleAbilityBuilder } from './battle-ability.builder';

interface BattleKittenOptions {
  id?: string;
  name?: string;
  level?: number;
  strength?: number;
  agility?: number;
  constitution?: number;
  intelligence?: number;
  maxHealth?: number;
  currentHealth?: number;
  abilities?: BattleAbility[];
}

export const battleKittenBuilder = ({
  id = 'battle-kitten-id-1',
  name = 'Test Battle Kitten',
  level = 1,
  strength = 5,
  agility = 5,
  constitution = 5,
  intelligence = 5,
  maxHealth,
  currentHealth,
  abilities = [battleAbilityBuilder().build()],
}: BattleKittenOptions = {}) => {
  const props = {
    id,
    name,
    level,
    strength,
    agility,
    constitution,
    intelligence,
    maxHealth,
    currentHealth,
    abilities,
  };

  return {
    withId(_id: string) {
      return battleKittenBuilder({ ...props, id: _id });
    },

    withName(_name: string) {
      return battleKittenBuilder({ ...props, name: _name });
    },

    withLevel(_level: number) {
      return battleKittenBuilder({ ...props, level: _level });
    },

    withStrength(_strength: number) {
      return battleKittenBuilder({ ...props, strength: _strength });
    },

    withAgility(_agility: number) {
      return battleKittenBuilder({ ...props, agility: _agility });
    },

    withConstitution(_constitution: number) {
      return battleKittenBuilder({ ...props, constitution: _constitution });
    },

    withIntelligence(_intelligence: number) {
      return battleKittenBuilder({ ...props, intelligence: _intelligence });
    },

    withMaxHealth(_maxHealth: number) {
      return battleKittenBuilder({ ...props, maxHealth: _maxHealth });
    },

    withCurrentHealth(_currentHealth: number) {
      return battleKittenBuilder({ ...props, currentHealth: _currentHealth });
    },

    withAbilities(_abilities: BattleAbility[]) {
      return battleKittenBuilder({ ...props, abilities: _abilities });
    },

    addAbility(ability: BattleAbility) {
      return battleKittenBuilder({ ...props, abilities: [...props.abilities, ability] });
    },

    build(): BattleKitten {
      return BattleKitten.create(
        props.id,
        props.name,
        props.level,
        props.strength,
        props.agility,
        props.constitution,
        props.intelligence,
        props.maxHealth,
        props.currentHealth,
        props.abilities
      );
    },
  };
};