import { Inject, Injectable } from '@nestjs/common';
import { BattleTokens } from '@/battles/tokens/tokens';
import { BattleRepository } from '@/battles/application/battle.repository';
import { Battle } from '@/battles/domain/battle';

export class FindAllBattlesQuery {
  constructor(public readonly userId?: string) {}
}

@Injectable()
export class FindAllBattlesUseCase {
  constructor(
    @Inject(BattleTokens.BattleRepository)
    private readonly battleRepository: BattleRepository,
  ) {}

  async execute(query: FindAllBattlesQuery): Promise<Battle[]> {
    if (query.userId) {
      return this.battleRepository.findByUserId(query.userId);
    }
    
    return this.battleRepository.findAll();
  }
}