import { v4 as uuidv4 } from 'uuid';

export class UserId {
  constructor(private readonly _value: string) {
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  public static generate(): UserId {
    return new UserId(uuidv4());
  }

  private validate(): void {
    if (this._value === null || this._value === undefined) {
      throw new Error('UserId cannot be null or undefined');
    }

    if (this._value === '') {
      throw new Error('UserId cannot be empty');
    }
  }

  public equals(id: UserId): boolean {
    return this._value === id.value;
  }
}