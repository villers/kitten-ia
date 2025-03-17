import { BattleLog } from '@prisma/client';
import { kittenBuilder } from './kitten.builder';
import { BattleStatus } from '../constants/enums';

interface BattleLogOptions {
  id?: string;
  challengerId?: string;
  opponentId?: string;
  winnerId?: string | null;
  status?: BattleStatus;
  seed?: number;
  replayData?: any;
  totalRounds?: number;
  currentRound?: number;
  experienceGain?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const battleLogBuilder = ({
  id = 'battle-log-id-1',
  challengerId = kittenBuilder().withId('challenger-id').build().id,
  opponentId = kittenBuilder().withId('opponent-id').build().id,
  winnerId = 'challenger-id',
  status = BattleStatus.COMPLETED,
  seed = 123456,
  replayData = {},
  totalRounds = 5,
  currentRound = 5,
  experienceGain = 50,
  createdAt = new Date(),
  updatedAt = new Date(),
}: BattleLogOptions = {}) => {
  const props = {
    id,
    challengerId,
    opponentId,
    winnerId,
    status,
    seed,
    replayData,
    totalRounds,
    currentRound,
    experienceGain,
    createdAt,
    updatedAt,
  };

  return {
    withId(_id: string) {
      return battleLogBuilder({ ...props, id: _id });
    },

    withChallengerId(_challengerId: string) {
      return battleLogBuilder({ ...props, challengerId: _challengerId });
    },

    withOpponentId(_opponentId: string) {
      return battleLogBuilder({ ...props, opponentId: _opponentId });
    },

    withWinnerId(_winnerId: string | null) {
      return battleLogBuilder({ ...props, winnerId: _winnerId });
    },

    withStatus(_status: BattleStatus) {
      return battleLogBuilder({ ...props, status: _status });
    },

    withSeed(_seed: number) {
      return battleLogBuilder({ ...props, seed: _seed });
    },

    withReplayData(_replayData: any) {
      return battleLogBuilder({ ...props, replayData: _replayData });
    },

    withTotalRounds(_totalRounds: number) {
      return battleLogBuilder({ ...props, totalRounds: _totalRounds });
    },

    withCurrentRound(_currentRound: number) {
      return battleLogBuilder({ ...props, currentRound: _currentRound });
    },

    withExperienceGain(_experienceGain: number) {
      return battleLogBuilder({ ...props, experienceGain: _experienceGain });
    },

    withCreatedAt(_createdAt: Date) {
      return battleLogBuilder({ ...props, createdAt: _createdAt });
    },

    withUpdatedAt(_updatedAt: Date) {
      return battleLogBuilder({ ...props, updatedAt: _updatedAt });
    },

    build(): BattleLog {
      return {
        id: props.id,
        challengerId: props.challengerId,
        opponentId: props.opponentId,
        winnerId: props.winnerId,
        status: props.status as any, // Type casting pour éviter les problèmes de compatibilité
        seed: props.seed,
        replayData: props.replayData,
        totalRounds: props.totalRounds,
        currentRound: props.currentRound,
        experienceGain: props.experienceGain,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      };
    },
  };
};
