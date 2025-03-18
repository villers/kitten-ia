import { KittenStats } from '@prisma/client';
import { kittenBuilder } from '@/test/builders/kitten.builder';

interface KittenStatsOptions {
  id?: string;
  wins?: number;
  losses?: number;
  draws?: number;
  kittenId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const kittenStatsBuilder = ({
  id = 'kitten-stats-id-1',
  wins = 0,
  losses = 0,
  draws = 0,
  kittenId = kittenBuilder().build().id,
  createdAt = new Date(),
  updatedAt = new Date(),
}: KittenStatsOptions = {}) => {
  const props = {
    id,
    wins,
    losses,
    draws,
    kittenId,
    createdAt,
    updatedAt,
  };

  return {
    withId(_id: string) {
      return kittenStatsBuilder({ ...props, id: _id });
    },

    withWins(_wins: number) {
      return kittenStatsBuilder({ ...props, wins: _wins });
    },

    withLosses(_losses: number) {
      return kittenStatsBuilder({ ...props, losses: _losses });
    },

    withDraws(_draws: number) {
      return kittenStatsBuilder({ ...props, draws: _draws });
    },

    withKittenId(_kittenId: string) {
      return kittenStatsBuilder({ ...props, kittenId: _kittenId });
    },

    withCreatedAt(_createdAt: Date) {
      return kittenStatsBuilder({ ...props, createdAt: _createdAt });
    },

    withUpdatedAt(_updatedAt: Date) {
      return kittenStatsBuilder({ ...props, updatedAt: _updatedAt });
    },

    build(): KittenStats {
      return {
        id: props.id,
        wins: props.wins,
        losses: props.losses,
        draws: props.draws,
        kittenId: props.kittenId,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      };
    },
  };
};
