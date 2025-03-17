export class KittenStat {
  constructor(private readonly _value: number) {
    this.validate();
  }

  get value(): number {
    return this._value;
  }

  private validate(): void {
    if (this._value === null || this._value === undefined || isNaN(this._value)) {
      throw new Error('Stat value must be a number');
    }

    if (this._value < 1) {
      throw new Error('Stat value cannot be less than 1');
    }

    if (this._value > 20) {
      throw new Error('Stat value cannot be greater than 20');
    }
  }

  public increment(amount: number): KittenStat {
    const newValue = Math.min(this._value + amount, 20);
    return new KittenStat(newValue);
  }

  public equals(stat: KittenStat): boolean {
    return this._value === stat.value;
  }
}