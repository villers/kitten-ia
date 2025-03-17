export class SkillPoints {
  constructor(private readonly _value: number = 0) {
    this.validate();
  }

  get value(): number {
    return this._value;
  }

  private validate(): void {
    if (this._value === null || this._value === undefined || isNaN(this._value)) {
      throw new Error('Skill points must be a number');
    }

    if (this._value < 0) {
      throw new Error('Skill points cannot be negative');
    }
  }

  public add(amount: number): SkillPoints {
    return new SkillPoints(this._value + amount);
  }

  public subtract(amount: number): SkillPoints {
    if (amount > this._value) {
      throw new Error('Cannot spend more skill points than available');
    }
    return new SkillPoints(this._value - amount);
  }

  public hasEnough(amount: number): boolean {
    return this._value >= amount;
  }

  public equals(points: SkillPoints): boolean {
    return this._value === points.value;
  }
}