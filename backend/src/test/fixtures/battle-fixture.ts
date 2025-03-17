import { BattleLog, BattleStatus, Kitten, User } from '@prisma/client';
import { InMemoryBattleRepository } from '../repositories/in-memory-battle-repository';
import { InMemoryKittenRepository } from '../repositories/in-memory-kitten-repository';
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository';
import { battleLogBuilder } from '../builders/battle-log.builder';
import { battleMoveBuilder } from '../builders/battle-move.builder';
import { CreateBattleDto } from '../../battles/dto/create-battle.dto';

export class BattleFixture {
  private battleRepository = new InMemoryBattleRepository();
  private kittenRepository = new InMemoryKittenRepository();
  private userRepository = new InMemoryUserRepository();
  private error: Error | null = null;
  private result: any = null;
  private date: Date = new Date();
  private randomSeed: number = 123456;

  givenBattleExists(battles: BattleLog[]): void {
    this.battleRepository.givenExists(battles);
  }

  givenKittenExists(kittens: Kitten[]): void {
    this.kittenRepository.givenExists(kittens);
  }

  givenUserExists(users: User[]): void {
    this.userRepository.givenExists(users);
  }

  givenCurrentDate(date: Date): void {
    this.date = date;
  }

  givenRandomSeed(seed: number): void {
    this.randomSeed = seed;
  }

  async whenCreateBattle(createBattleDto: CreateBattleDto, challengerId: string, userId: string): Promise<void> {
    try {
      // In a real implementation, we'd use a service here with battle engine
      
      // Check if the challenger kitten belongs to the user
      const challenger = await this.kittenRepository.findById(challengerId);
      if (!challenger) {
        throw new Error(`Challenger kitten with ID ${challengerId} not found`);
      }

      if (challenger.userId !== userId) {
        throw new Error('You can only battle with your own kittens');
      }

      // Check if the opponent kitten exists
      const opponent = await this.kittenRepository.findById(createBattleDto.opponentId);
      if (!opponent) {
        throw new Error(`Opponent kitten with ID ${createBattleDto.opponentId} not found`);
      }

      // A kitten cannot battle against itself
      if (challenger.id === opponent.id) {
        throw new Error('A kitten cannot battle against itself');
      }

      // Create battle log (in a real scenario this would be handled by BattleEngineService)
      const battleLog = battleLogBuilder({
        challengerId: challenger.id,
        opponentId: opponent.id,
        winnerId: challenger.id, // Just for the fixture, real logic would determine this
        status: BattleStatus.COMPLETED,
        seed: this.randomSeed,
        replayData: { rounds: [{ attackerId: challenger.id, damage: 10 }] },
        totalRounds: 1,
        currentRound: 1,
        experienceGain: 50,
        createdAt: this.date,
        updatedAt: this.date,
      }).build();

      // Create a battle move
      const battleMove = battleMoveBuilder({
        round: 1,
        kittenId: challenger.id,
        damage: 10,
        isSuccess: true,
        battleLogId: battleLog.id,
        createdAt: this.date,
      }).build();

      // Save battle log and move
      await this.battleRepository.save(battleLog);
      await this.battleRepository.saveBattleMove(battleMove);

      // Update winner experience
      await this.kittenRepository.updateExperience(challenger.id, battleLog.experienceGain);

      this.result = battleLog;
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenFindBattleById(id: string): Promise<void> {
    try {
      this.result = await this.battleRepository.findById(id);
      if (!this.result) {
        throw new Error(`Battle with ID ${id} not found`);
      }
      
      // Get battle moves
      const moves = await this.battleRepository.getBattleMoves(id);
      this.result.battleMoves = moves;
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenFindBattlesByUserId(userId: string): Promise<void> {
    try {
      // Get all kittens for this user
      const kittens = await this.kittenRepository.findByUserId(userId);
      
      // Find battles for these kittens
      this.result = await this.battleRepository.findByUserId(userId, kittens);
    } catch (error) {
      this.error = error as Error;
    }
  }

  thenBattleShouldExist(expectedBattle: BattleLog): void {
    expect(this.result).toEqual(expectedBattle);
  }

  thenBattleShouldNotBeFound(): void {
    expect(this.result).toBeNull();
  }

  thenBattleStatusShouldBe(status: BattleStatus): void {
    expect(this.result.status).toEqual(status);
  }

  thenWinnerShouldBe(kittenId: string): void {
    expect(this.result.winnerId).toEqual(kittenId);
  }

  thenBattleMovesShouldHaveLength(length: number): void {
    expect(this.result.battleMoves).toHaveLength(length);
  }

  thenErrorShouldBe(expectedErrorClass: new () => Error): void {
    expect(this.error).toBeInstanceOf(expectedErrorClass);
  }

  thenErrorMessageShouldContain(text: string): void {
    expect(this.error?.message).toContain(text);
  }

  getRepository(): InMemoryBattleRepository {
    return this.battleRepository;
  }

  getKittenRepository(): InMemoryKittenRepository {
    return this.kittenRepository;
  }

  getUserRepository(): InMemoryUserRepository {
    return this.userRepository;
  }
}

export const createBattleFixture = (): BattleFixture => {
  return new BattleFixture();
};
