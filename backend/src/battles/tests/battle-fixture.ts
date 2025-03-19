import { Battle } from '@/battles/domain/battle';
import { BattleKitten } from '@/battles/domain/battle-kitten';
import { BattleEngine } from '@/battles/domain/battle-engine';
import { BattleNotFoundError } from '@/battles/domain/errors';
import { InMemoryBattleRepository } from '@/battles/tests/in-memory-battle-repository';
import { battleBuilder } from '@/battles/tests/battle-builder';
import { battleKittenBuilder } from '@/battles/tests/battle-kitten-builder';
import { battleAbilityBuilder } from '@/battles/tests/battle-ability-builder';
import { expect } from 'vitest';

export class BattleFixture {
  private battleRepository = new InMemoryBattleRepository();
  private readonly battleEngine = new BattleEngine();
  private error: Error | null = null;
  private result: any = null;

  givenBattleExists(battles: Battle[]): void {
    this.battleRepository.givenExists(battles);
  }

  async whenFindBattleById(id: string): Promise<void> {
    try {
      this.result = await this.battleRepository.findById(id);
      if (!this.result) {
        throw new BattleNotFoundError(id);
      }
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenCreateBattle(
    id: string,
    seed: number,
    challenger: BattleKitten,
    opponent: BattleKitten
  ): Promise<void> {
    try {
      const battle = battleBuilder()
        .withId(id)
        .withSeed(seed)
        .withChallenger(challenger)
        .withOpponent(opponent)
        .build();
      const simulatedBattle = this.battleEngine.simulateBattle(battle);
      this.result = await this.battleRepository.create(simulatedBattle);
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenSimulateBattle(battle: Battle): Promise<void> {
    try {
      this.result = this.battleEngine.simulateBattle(battle);
    } catch (error) {
      this.error = error as Error;
    }
  }

  thenBattleShouldExist(): void {
    expect(this.result).toBeDefined();
  }

  thenBattleShouldNotBeFound(): void {
    expect(this.result).toBeNull();
  }

  thenErrorShouldBe(expectedErrorClass: new () => Error): void {
    expect(this.error).toBeInstanceOf(expectedErrorClass);
  }

  thenErrorMessageShouldContain(text: string): void {
    expect(this.error?.message).toContain(text);
  }

  thenBattleShouldBeFinished(): void {
    expect(this.result.isFinished).toBe(true);
  }

  thenWinnerShouldBe(kittenId: string): void {
    expect(this.result.winnerId).toBe(kittenId);
  }

  thenExperienceGainShouldBePositive(): void {
    expect(this.result.experienceGain).toBeGreaterThan(0);
  }

  thenRoundsShouldBeGreaterThan(value: number): void {
    expect(this.result.round).toBeGreaterThan(value);
  }

  getRepository(): InMemoryBattleRepository {
    return this.battleRepository;
  }

  setRepository(repository: InMemoryBattleRepository): void {
    this.battleRepository = repository;
  }

  getError(): Error | null {
    return this.error;
  }

  getResult(): any {
    return this.result;
  }
  
  setResult(result: any): void {
    this.result = result;
  }
  
  setError(error: Error): void {
    this.error = error;
  }
}

export const createBattleFixture = (): BattleFixture => {
  return new BattleFixture();
};