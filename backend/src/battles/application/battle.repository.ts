import { Battle } from '@/battles/domain/battle';

export interface BattleRepository {
  create(battle: Battle): Promise<Battle>;
  findById(id: string): Promise<Battle | null>;
  findAll(): Promise<Battle[]>;
  findByUserId(userId: string): Promise<Battle[]>;
  update(battle: Battle): Promise<Battle>;
}