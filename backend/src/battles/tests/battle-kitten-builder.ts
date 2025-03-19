import { BattleKitten, BattleAbility } from '@/battles/domain/battle-kitten';

interface BattleKittenBuilderOptions {
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

export const battleKittenBuilder = (options: BattleKittenBuilderOptions = {}) => {
  const props = {
    id: options.id ?? 'kitten-id-1',
    name: options.name ?? 'Test Kitten',
    level: options.level ?? 1,
    strength: options.strength ?? 5,
    agility: options.agility ?? 5,
    constitution: options.constitution ?? 5,
    intelligence: options.intelligence ?? 5,
    maxHealth: options.maxHealth,
    currentHealth: options.currentHealth,
    abilities: options.abilities ?? []
  };

  return {
    withId(id: string) {
      return battleKittenBuilder({ ...options, id });
    },

    withName(name: string) {
      return battleKittenBuilder({ ...options, name });
    },

    withLevel(level: number) {
      return battleKittenBuilder({ ...options, level });
    },

    withStrength(strength: number) {
      return battleKittenBuilder({ ...options, strength });
    },

    withAgility(agility: number) {
      return battleKittenBuilder({ ...options, agility });
    },

    withConstitution(constitution: number) {
      return battleKittenBuilder({ ...options, constitution });
    },

    withIntelligence(intelligence: number) {
      return battleKittenBuilder({ ...options, intelligence });
    },

    withMaxHealth(maxHealth: number) {
      return battleKittenBuilder({ ...options, maxHealth });
    },

    withCurrentHealth(currentHealth: number) {
      return battleKittenBuilder({ ...options, currentHealth });
    },

    withAbilities(abilities: BattleAbility[]) {
      return battleKittenBuilder({ ...options, abilities });
    },

    build(): BattleKitten {
      // If currentHealth is explicitly set to 0, we need to use the constructor directly
      // because BattleKitten.create() treats 0 as falsy and falls back to maxHealth
      if (options.currentHealth === 0) {
        const maxHealth = props.maxHealth || 50 + (props.constitution * 10) + (props.level * 5);
        return new BattleKitten(
          props.id,
          props.name,
          props.level,
          props.strength,
          props.agility,
          props.constitution,
          props.intelligence,
          maxHealth,
          0, // Explicitly set to 0
          props.abilities
        );
      }
      
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
    }
  };
};
