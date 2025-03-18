import { Ability } from '@/abilities/domain/ability';

export interface AbilityRepository {
  findById(id: string): Promise<Ability | null>;
  findByKittenId(kittenId: string): Promise<Ability[]>;
  findAll(): Promise<Ability[]>;
  save(ability: Ability): Promise<Ability>;
  delete(id: string): Promise<void>;
}
