import { BattleLog, BattleMove } from '@prisma/client';
import { InMemoryRepository } from '@/test/repositories/in-memory-repository';

export class InMemoryBattleRepository extends InMemoryRepository<BattleLog> {
  private readonly battleMoves: Map<string, BattleMove[]> = new Map();

  async findByKittenId(kittenId: string): Promise<BattleLog[]> {
    const battles = Array.from(this.items.values());
    return battles.filter(
      battle => battle.challengerId === kittenId || battle.opponentId === kittenId
    );
  }

  async findByUserId(userId: string, kittens: { id: string }[]): Promise<BattleLog[]> {
    const kittenIds = kittens.map(kitten => kitten.id);
    const battles = Array.from(this.items.values());
    
    return battles.filter(
      battle => 
        kittenIds.includes(battle.challengerId) || 
        kittenIds.includes(battle.opponentId)
    );
  }

  async saveBattleMove(battleMove: BattleMove): Promise<BattleMove> {
    let moves = this.battleMoves.get(battleMove.battleLogId) || [];
    moves = [...moves, battleMove];
    this.battleMoves.set(battleMove.battleLogId, moves);
    return battleMove;
  }

  async getBattleMoves(battleLogId: string): Promise<BattleMove[]> {
    return this.battleMoves.get(battleLogId) || [];
  }

  override async clear(): Promise<void> {
    await super.clear();
    this.battleMoves.clear();
  }
}
