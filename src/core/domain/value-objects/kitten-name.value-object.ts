export class KittenName {
  constructor(private readonly _value: string) {
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  private validate(): void {
    if (this._value === null || this._value === undefined) {
      throw new Error('Kitten name cannot be null or undefined');
    }

    if (this._value === '') {
      throw new Error('Kitten name cannot be empty');
    }

    if (this._value.length < 3) {
      throw new Error('Kitten name must be at least 3 characters long');
    }

    if (this._value.length > 50) {
      throw new Error('Kitten name cannot exceed 50 characters');
    }
  }

  public equals(name: KittenName): boolean {
    return this._value === name.value;
  }
}