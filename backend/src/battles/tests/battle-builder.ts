import { Battle } from '@/battles/domain/battle';
import { BattleKitten } from '@/battles/domain/battle-kitten';
import { BattleLogEntry } from '@/battles/domain/battle-log-entry';

interface BattleBuilderOptions {
  id?: string;
  round?: number;
  seed?: number;
  challenger?: BattleKitten;
  opponent?: BattleKitten;
  logs?: BattleLogEntry[];
  isFinished?: boolean;
  winnerId?: string;
  experienceGain?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const battleBuilder = (options: BattleBuilderOptions = {}) => {
  const props = {
    id: options.id ?? 'battle-id-1',
    round: options.round ?? 0,
    seed: options.seed ?? 12345,
    challenger: options.challenger,
    opponent: options.opponent,
    logs: options.logs ?? [],
    isFinished: options.isFinished ?? false,
    winnerId: options.winnerId,
    experienceGain: options.experienceGain ?? 0,
    createdAt: options.createdAt || new Date('2024-01-01T00:00:00Z'),
    updatedAt: options.updatedAt || new Date('2024-01-01T00:00:00Z'),
  };

  return {
    withId(id: string) {
      return battleBuilder({ ...options, id });
    },

    withRound(round: number) {
      return battleBuilder({ ...options, round });
    },

    withSeed(seed: number) {
      return battleBuilder({ ...options, seed });
    },

    withChallenger(challenger: BattleKitten) {
      return battleBuilder({ ...options, challenger });
    },

    withOpponent(opponent: BattleKitten) {
      return battleBuilder({ ...options, opponent });
    },

    withLogs(logs: BattleLogEntry[]) {
      return battleBuilder({ ...options, logs });
    },

    withIsFinished(isFinished: boolean) {
      return battleBuilder({ ...options, isFinished });
    },

    withWinnerId(winnerId: string | undefined) {
      return battleBuilder({ ...options, winnerId });
    },

    withExperienceGain(experienceGain: number) {
      return battleBuilder({ ...options, experienceGain });
    },

    withCreatedAt(createdAt: Date) {
      return battleBuilder({ ...options, createdAt });
    },

    withUpdatedAt(updatedAt: Date) {
      return battleBuilder({ ...options, updatedAt });
    },

    build(): Battle {
      if (!props.challenger || !props.opponent) {
        throw new Error('Battle requires both challenger and opponent');
      }
      
      return new Battle(
        props.id,
        props.round,
        props.seed,
        props.challenger,
        props.opponent,
        props.logs,
        props.isFinished,
        props.winnerId,
        props.experienceGain,
        props.createdAt,
        props.updatedAt
      );
    }
  };
};
