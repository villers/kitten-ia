import { BattleLogEntry } from '@/battles/domain/battle-log-entry';

interface BattleLogEntryBuilderOptions {
  round?: number;
  turn?: number;
  attackerId?: string;
  defenderId?: string;
  abilityId?: string;
  abilityName?: string;
  damage?: number;
  isSuccess?: boolean;
  isCritical?: boolean;
  message?: string;
  attackerHealth?: number;
  defenderHealth?: number;
}

export const battleLogEntryBuilder = (options: BattleLogEntryBuilderOptions = {}) => {
  const props = {
    round: options.round ?? 1,
    turn: options.turn ?? 1,
    attackerId: options.attackerId ?? 'attacker-id-1',
    defenderId: options.defenderId ?? 'defender-id-1',
    abilityId: options.abilityId ?? 'ability-id-1',
    abilityName: options.abilityName ?? 'Scratch',
    damage: options.damage ?? 10,
    isSuccess: options.isSuccess ?? true,
    isCritical: options.isCritical ?? false,
    message: options.message ?? 'Attacker used Scratch for 10 damage!',
    attackerHealth: options.attackerHealth ?? 100,
    defenderHealth: options.defenderHealth ?? 90
  };

  return {
    withRound(round: number) {
      return battleLogEntryBuilder({ ...options, round });
    },

    withTurn(turn: number) {
      return battleLogEntryBuilder({ ...options, turn });
    },

    withAttackerId(attackerId: string) {
      return battleLogEntryBuilder({ ...options, attackerId });
    },

    withDefenderId(defenderId: string) {
      return battleLogEntryBuilder({ ...options, defenderId });
    },

    withAbilityId(abilityId: string) {
      return battleLogEntryBuilder({ ...options, abilityId });
    },

    withAbilityName(abilityName: string) {
      return battleLogEntryBuilder({ ...options, abilityName });
    },

    withDamage(damage: number) {
      return battleLogEntryBuilder({ ...options, damage });
    },

    withIsSuccess(isSuccess: boolean) {
      return battleLogEntryBuilder({ ...options, isSuccess });
    },

    withIsCritical(isCritical: boolean) {
      return battleLogEntryBuilder({ ...options, isCritical });
    },

    withMessage(message: string) {
      return battleLogEntryBuilder({ ...options, message });
    },

    withAttackerHealth(attackerHealth: number) {
      return battleLogEntryBuilder({ ...options, attackerHealth });
    },

    withDefenderHealth(defenderHealth: number) {
      return battleLogEntryBuilder({ ...options, defenderHealth });
    },

    build(): BattleLogEntry {
      return BattleLogEntry.create(
        props.round,
        props.turn,
        props.attackerId,
        props.defenderId,
        props.abilityId,
        props.abilityName,
        props.damage,
        props.isSuccess,
        props.isCritical,
        props.message,
        props.attackerHealth,
        props.defenderHealth
      );
    }
  };
};
