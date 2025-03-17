import { BattleMove } from '@prisma/client';
import { kittenBuilder } from './kitten.builder';
import { abilityBuilder } from './ability.builder';
import { battleLogBuilder } from './battle-log.builder';

interface BattleMoveOptions {
  id?: string;
  round?: number;
  kittenId?: string;
  abilityId?: string;
  damage?: number;
  isSuccess?: boolean;
  isCritical?: boolean;
  battleLogId?: string;
  createdAt?: Date;
}

export const battleMoveBuilder = ({
  id = 'battle-move-id-1',
  round = 1,
  kittenId = kittenBuilder().build().id,
  abilityId = abilityBuilder().build().id,
  damage = 15,
  isSuccess = true,
  isCritical = false,
  battleLogId = battleLogBuilder().build().id,
  createdAt = new Date(),
}: BattleMoveOptions = {}) => {
  const props = {
    id,
    round,
    kittenId,
    abilityId,
    damage,
    isSuccess,
    isCritical,
    battleLogId,
    createdAt,
  };

  return {
    withId(_id: string) {
      return battleMoveBuilder({ ...props, id: _id });
    },

    withRound(_round: number) {
      return battleMoveBuilder({ ...props, round: _round });
    },

    withKittenId(_kittenId: string) {
      return battleMoveBuilder({ ...props, kittenId: _kittenId });
    },

    withAbilityId(_abilityId: string) {
      return battleMoveBuilder({ ...props, abilityId: _abilityId });
    },

    withDamage(_damage: number) {
      return battleMoveBuilder({ ...props, damage: _damage });
    },

    withIsSuccess(_isSuccess: boolean) {
      return battleMoveBuilder({ ...props, isSuccess: _isSuccess });
    },

    withIsCritical(_isCritical: boolean) {
      return battleMoveBuilder({ ...props, isCritical: _isCritical });
    },

    withBattleLogId(_battleLogId: string) {
      return battleMoveBuilder({ ...props, battleLogId: _battleLogId });
    },

    withCreatedAt(_createdAt: Date) {
      return battleMoveBuilder({ ...props, createdAt: _createdAt });
    },

    build(): BattleMove {
      return {
        id: props.id,
        round: props.round,
        kittenId: props.kittenId,
        abilityId: props.abilityId,
        damage: props.damage,
        isSuccess: props.isSuccess,
        isCritical: props.isCritical,
        battleLogId: props.battleLogId,
        createdAt: props.createdAt,
      };
    },
  };
};
