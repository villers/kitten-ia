import { v4 as uuidv4 } from 'uuid';

export class KittenId {
  constructor(private readonly _value: string) {
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  public static generate(): KittenId {
    return new KittenId(uuidv4());
  }

  private validate(): void {
    if (this._value === null || this._value === undefined) {
      throw new Error('KittenId cannot be null or undefined');
    }

    if (this._value === '') {
      throw new Error('KittenId cannot be empty');
    }
  }

  public equals(id: KittenId): boolean {
    return this._value === id.value;
  }
}