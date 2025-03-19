import { Battle } from '@/battles/domain/battle';
import { BattleRepository } from '@/battles/application/battle.repository';
import { InMemoryRepository } from '@/test/repositories/in-memory-repository';

export class InMemoryBattleRepository extends InMemoryRepository<Battle> implements BattleRepository {
  async create(battle: Battle): Promise<Battle> {
    return this.save(battle);
  }

  async findByUserId(userId: string): Promise<Battle[]> {
    // Dans un repository en mémoire pour les tests, on simule cette fonctionnalité
    // En supposant que les userId sont stockés dans le challenger et opponent
    return this.findAll().then(battles => 
      battles.filter(battle => 
        battle.challenger.id === userId || 
        battle.opponent.id === userId
      )
    );
  }

  async update(battle: Battle): Promise<Battle> {
    return this.save(battle);
  }
  
  givenExists(battles: Battle[]): void {
    battles.forEach(battle => {
      this.items.set(battle.id, battle);
    });
  }
}