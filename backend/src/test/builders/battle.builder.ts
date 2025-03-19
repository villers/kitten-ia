import { Battle } from '@/battles/domain/battle';
import { BattleKitten } from '@/battles/domain/battle-kitten';
import { BattleLogEntry } from '@/battles/domain/battle-log-entry';
import { battleKittenBuilder } from '@/test/builders/battle-kitten.builder';

interface BattleOptions {
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

export const battleBuilder = ({
  id = 'battle-id-1',
  round = 0,
  seed = 123456,
  challenger = battleKittenBuilder().build(),
  opponent = battleKittenBuilder().withId('opponent-id-1').withName('Opponent').build(),
  logs = [],
  isFinished = false,
  winnerId,
  experienceGain = 0,
  createdAt = new Date(),
  updatedAt = new Date(),
}: BattleOptions = {}) => {
  // Créer une bataille avec les valeurs de base
  let battleInstance = Battle.create(id, seed, challenger, opponent);
  
  // Mise à jour des propriétés supplémentaires
  if (round > 0) {
    battleInstance = battleInstance.withRound(round);
  }
  
  // Ajouter les logs
  for (const log of logs) {
    battleInstance = battleInstance.addLog(log);
  }
  
  // Terminer la bataille si nécessaire
  if (isFinished) {
    battleInstance = battleInstance.finish(winnerId);
  }
  
  // Ajouter l'expérience
  if (experienceGain > 0) {
    battleInstance = battleInstance.withExperienceGain(experienceGain);
  }
  
  const props = {
    id,
    round,
    seed,
    challenger,
    opponent,
    logs,
    isFinished,
    winnerId,
    experienceGain,
    createdAt,
    updatedAt,
    battleInstance,
  };

  return {
    withId(_id: string) {
      return battleBuilder({ ...props, id: _id });
    },

    withRound(_round: number) {
      return battleBuilder({ ...props, round: _round });
    },

    withSeed(_seed: number) {
      return battleBuilder({ ...props, seed: _seed });
    },

    withChallenger(_challenger: BattleKitten) {
      return battleBuilder({ ...props, challenger: _challenger });
    },

    withOpponent(_opponent: BattleKitten) {
      return battleBuilder({ ...props, opponent: _opponent });
    },

    withLogs(_logs: BattleLogEntry[]) {
      return battleBuilder({ ...props, logs: _logs });
    },

    addLog(log: BattleLogEntry) {
      return battleBuilder({ ...props, logs: [...props.logs, log] });
    },

    withIsFinished(_isFinished: boolean) {
      return battleBuilder({ ...props, isFinished: _isFinished });
    },

    withWinnerId(_winnerId?: string) {
      return battleBuilder({ ...props, winnerId: _winnerId, isFinished: true });
    },

    withExperienceGain(_experienceGain: number) {
      return battleBuilder({ ...props, experienceGain: _experienceGain });
    },

    withCreatedAt(_createdAt: Date) {
      return battleBuilder({ ...props, createdAt: _createdAt });
    },

    withUpdatedAt(_updatedAt: Date) {
      return battleBuilder({ ...props, updatedAt: _updatedAt });
    },

    build(): Battle {
      return props.battleInstance;
    },
  };
};