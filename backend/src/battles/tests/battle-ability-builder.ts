import { BattleAbility } from '@/battles/domain/battle-kitten';

interface BattleAbilityBuilderOptions {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  power?: number;
  accuracy?: number;
  cooldown?: number;
  currentCooldown?: number;
}

export const battleAbilityBuilder = (options: BattleAbilityBuilderOptions = {}) => {
  const props = {
    id: options.id ?? 'ability-id-1',
    name: options.name ?? 'Scratch',
    description: options.description ?? 'A basic scratch attack',
    type: options.type ?? 'physical',
    power: options.power ?? 10,
    accuracy: options.accuracy ?? 90,
    cooldown: options.cooldown ?? 0,
    currentCooldown: options.currentCooldown ?? 0
  };

  return {
    withId(id: string) {
      return battleAbilityBuilder({ ...options, id });
    },

    withName(name: string) {
      return battleAbilityBuilder({ ...options, name });
    },

    withDescription(description: string) {
      return battleAbilityBuilder({ ...options, description });
    },

    withType(type: string) {
      return battleAbilityBuilder({ ...options, type });
    },

    withPower(power: number) {
      return battleAbilityBuilder({ ...options, power });
    },

    withAccuracy(accuracy: number) {
      return battleAbilityBuilder({ ...options, accuracy });
    },

    withCooldown(cooldown: number) {
      return battleAbilityBuilder({ ...options, cooldown });
    },

    withCurrentCooldown(currentCooldown: number) {
      return battleAbilityBuilder({ ...options, currentCooldown });
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
    }
  };
};
