import { BattleKitten } from '@/battles/domain/battle-kitten';

export interface KittenRepository {
  findById(id: string): Promise<BattleKitten | null>;
  updateExperience(kittenId: string, experienceGain: number): Promise<void>;
  updateStats(winnerId: string, loserId: string): Promise<void>;
  isOwner(kittenId: string, userId: string): Promise<boolean>;
}