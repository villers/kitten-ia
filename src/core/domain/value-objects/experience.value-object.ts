export class Experience {
  constructor(private readonly _value: number = 0) {
    this.validate();
  }

  get value(): number {
    return this._value;
  }

  private validate(): void {
    if (this._value === null || this._value === undefined || isNaN(this._value)) {
      throw new Error('Experience must be a number');
    }

    if (this._value < 0) {
      throw new Error('Experience cannot be negative');
    }
  }

  public add(amount: number): Experience {
    return new Experience(this._value + amount);
  }

  /**
   * Calculate the level based on experience points
   * Level formula: 1 + floor(sqrt(experience / 100))
   */
  public calculateLevel(): number {
    return 1 + Math.floor(Math.sqrt(this._value / 100));
  }

  /**
   * Calculate experience needed for the next level
   */
  public experienceForNextLevel(): number {
    const currentLevel = this.calculateLevel();
    const expForNextLevel = Math.pow(currentLevel, 2) * 100;
    return expForNextLevel - this._value;
  }

  public equals(exp: Experience): boolean {
    return this._value === exp.value;
  }
}