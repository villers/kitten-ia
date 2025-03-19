import { Inject, Injectable } from '@nestjs/common';
import { BattleTokens } from '@/battles/tokens/tokens';
import { BattleRepository } from '@/battles/application/battle.repository';
import { Battle } from '@/battles/domain/battle';
import { BattleNotFoundError } from '@/battles/domain/errors';

export class FindBattleByIdQuery {
  constructor(public readonly id: string) {}
}

@Injectable()
export class FindBattleByIdUseCase {
  constructor(
    @Inject(BattleTokens.BattleRepository)
    private readonly battleRepository: BattleRepository,
  ) {}

  async execute(query: FindBattleByIdQuery): Promise<Battle> {
    const battle = await this.battleRepository.findById(query.id);
    
    if (!battle) {
      throw new BattleNotFoundError(query.id);
    }
    
    return battle;
  }
}