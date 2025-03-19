import { Kitten } from '@/kittens/domain/kitten';

export interface KittenRepository {
  findById(id: string): Promise<Kitten | null>;
  findByName(name: string): Promise<Kitten | null>;
  findByUserId(userId: string): Promise<Kitten[]>;
  findAll(): Promise<Kitten[]>;
  save(kitten: Kitten): Promise<Kitten>;
  delete(id: string): Promise<void>;
  isOwner(kittenId: string, userId: string): Promise<boolean>;
  updateStats(winnerId: string, loserId: string): Promise<void>;
  updateExperience(kittenId: string, experienceGain: number): Promise<void>;
}
