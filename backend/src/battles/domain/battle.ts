import { BattleKitten } from './battle-kitten';
import { BattleLogEntry } from './battle-log-entry';

export class Battle {
  constructor(
    private readonly _id: string,
    private readonly _round: number,
    private readonly _seed: number,
    private readonly _challenger: BattleKitten,
    private readonly _opponent: BattleKitten,
    private readonly _logs: ReadonlyArray<BattleLogEntry>,
    private readonly _isFinished: boolean,
    private readonly _winnerId?: string,
    private readonly _experienceGain: number = 0,
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date()
  ) {}

  static create(
    id: string,
    seed: number, 
    challenger: BattleKitten,
    opponent: BattleKitten,
  ): Battle {
    return new Battle(
      id,
      0,
      seed,
      challenger,
      opponent,
      [],
      false,
      undefined,
      0,
      new Date(),
      new Date()
    );
  }

  get id(): string {
    return this._id;
  }

  get round(): number {
    return this._round;
  }

  get seed(): number {
    return this._seed;
  }

  get challenger(): BattleKitten {
    return this._challenger;
  }

  get opponent(): BattleKitten {
    return this._opponent;
  }

  get logs(): ReadonlyArray<BattleLogEntry> {
    return this._logs;
  }

  get isFinished(): boolean {
    return this._isFinished;
  }

  get winnerId(): string | undefined {
    return this._winnerId;
  }

  get experienceGain(): number {
    return this._experienceGain;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  withRound(round: number): Battle {
    return new Battle(
      this._id,
      round,
      this._seed,
      this._challenger,
      this._opponent,
      this._logs,
      this._isFinished,
      this._winnerId,
      this._experienceGain,
      this._createdAt,
      new Date()
    );
  }

  withChallenger(challenger: BattleKitten): Battle {
    return new Battle(
      this._id,
      this._round,
      this._seed,
      challenger,
      this._opponent,
      this._logs,
      this._isFinished,
      this._winnerId,
      this._experienceGain,
      this._createdAt,
      new Date()
    );
  }

  withOpponent(opponent: BattleKitten): Battle {
    return new Battle(
      this._id,
      this._round,
      this._seed,
      this._challenger,
      opponent,
      this._logs,
      this._isFinished,
      this._winnerId,
      this._experienceGain,
      this._createdAt,
      new Date()
    );
  }

  addLog(log: BattleLogEntry): Battle {
    return new Battle(
      this._id,
      this._round,
      this._seed,
      this._challenger,
      this._opponent,
      [...this._logs, log],
      this._isFinished,
      this._winnerId,
      this._experienceGain,
      this._createdAt,
      new Date()
    );
  }

  finish(winnerId?: string): Battle {
    return new Battle(
      this._id,
      this._round,
      this._seed,
      this._challenger,
      this._opponent,
      this._logs,
      true,
      winnerId,
      this._experienceGain,
      this._createdAt,
      new Date()
    );
  }

  withExperienceGain(experienceGain: number): Battle {
    return new Battle(
      this._id,
      this._round,
      this._seed,
      this._challenger,
      this._opponent,
      this._logs,
      this._isFinished,
      this._winnerId,
      experienceGain,
      this._createdAt,
      new Date()
    );
  }

  isBattleFinished(): boolean {
    return this._challenger.isDead() || this._opponent.isDead() || this._round >= 30;
  }

  determineWinner(): string | undefined {
    if (this._challenger.isDead()) {
      return this._opponent.id;
    } else if (this._opponent.isDead()) {
      return this._challenger.id;
    }
    // Match nul si on atteint 30 rounds sans vainqueur
    return undefined;
  }

  toJSON() {
    return {
      id: this._id,
      round: this._round,
      seed: this._seed,
      challenger: this._challenger.toJSON(),
      opponent: this._opponent.toJSON(),
      logs: this._logs.map(log => log.toJSON()),
      isFinished: this._isFinished,
      winnerId: this._winnerId,
      experienceGain: this._experienceGain,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}