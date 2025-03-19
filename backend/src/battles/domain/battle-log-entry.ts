export class BattleLogEntry {
  constructor(
    private readonly _round: number,
    private readonly _turn: number,
    private readonly _attackerId: string,
    private readonly _defenderId: string,
    private readonly _abilityId: string,
    private readonly _abilityName: string,
    private readonly _damage: number,
    private readonly _isSuccess: boolean,
    private readonly _isCritical: boolean,
    private readonly _message: string,
    private readonly _attackerHealth: number,
    private readonly _defenderHealth: number
  ) {}

  static create(
    round: number,
    turn: number,
    attackerId: string,
    defenderId: string,
    abilityId: string,
    abilityName: string,
    damage: number,
    isSuccess: boolean,
    isCritical: boolean,
    message: string,
    attackerHealth: number,
    defenderHealth: number,
  ): BattleLogEntry {
    return new BattleLogEntry(
      round,
      turn,
      attackerId,
      defenderId,
      abilityId,
      abilityName,
      damage,
      isSuccess,
      isCritical,
      message,
      attackerHealth,
      defenderHealth
    );
  }

  get round(): number {
    return this._round;
  }

  get turn(): number {
    return this._turn;
  }

  get attackerId(): string {
    return this._attackerId;
  }

  get defenderId(): string {
    return this._defenderId;
  }

  get abilityId(): string {
    return this._abilityId;
  }

  get abilityName(): string {
    return this._abilityName;
  }

  get damage(): number {
    return this._damage;
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isCritical(): boolean {
    return this._isCritical;
  }

  get message(): string {
    return this._message;
  }
  
  get attackerHealth(): number {
    return this._attackerHealth;
  }

  get defenderHealth(): number {
    return this._defenderHealth;
  }

  toJSON() {
    return {
      round: this._round,
      turn: this._turn,
      attackerId: this._attackerId,
      defenderId: this._defenderId,
      abilityId: this._abilityId,
      abilityName: this._abilityName,
      damage: this._damage,
      isSuccess: this._isSuccess,
      isCritical: this._isCritical,
      message: this._message,
      attackerHealth: this._attackerHealth,
      defenderHealth: this._defenderHealth
    };
  }
}