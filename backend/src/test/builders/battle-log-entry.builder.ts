import { BattleLogEntry } from '@/battles/domain/battle-log-entry';

interface BattleLogEntryOptions {
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

export const battleLogEntryBuilder = ({
  round = 1,
  turn = 1,
  attackerId = 'attacker-id-1',
  defenderId = 'defender-id-1',
  abilityId = 'ability-id-1',
  abilityName = 'Test Ability',
  damage = 10,
  isSuccess = true,
  isCritical = false,
  message = 'Test attack message',
  attackerHealth = 100,
  defenderHealth = 90,
}: BattleLogEntryOptions = {}) => {
  const props = {
    round,
    turn,
    attackerId,
    defenderId,
    abilityId,
    abilityName,
    damage,
    isSuccess,
    isCritical,
    message,
    attackerHealth,
    defenderHealth,
  };

  return {
    withRound(_round: number) {
      return battleLogEntryBuilder({ ...props, round: _round });
    },

    withTurn(_turn: number) {
      return battleLogEntryBuilder({ ...props, turn: _turn });
    },

    withAttackerId(_attackerId: string) {
      return battleLogEntryBuilder({ ...props, attackerId: _attackerId });
    },

    withDefenderId(_defenderId: string) {
      return battleLogEntryBuilder({ ...props, defenderId: _defenderId });
    },

    withAbilityId(_abilityId: string) {
      return battleLogEntryBuilder({ ...props, abilityId: _abilityId });
    },

    withAbilityName(_abilityName: string) {
      return battleLogEntryBuilder({ ...props, abilityName: _abilityName });
    },

    withDamage(_damage: number) {
      return battleLogEntryBuilder({ ...props, damage: _damage });
    },

    withIsSuccess(_isSuccess: boolean) {
      return battleLogEntryBuilder({ ...props, isSuccess: _isSuccess });
    },

    withIsCritical(_isCritical: boolean) {
      return battleLogEntryBuilder({ ...props, isCritical: _isCritical });
    },

    withMessage(_message: string) {
      return battleLogEntryBuilder({ ...props, message: _message });
    },

    withAttackerHealth(_attackerHealth: number) {
      return battleLogEntryBuilder({ ...props, attackerHealth: _attackerHealth });
    },

    withDefenderHealth(_defenderHealth: number) {
      return battleLogEntryBuilder({ ...props, defenderHealth: _defenderHealth });
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
    },
  };
};