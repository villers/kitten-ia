import { KittenNameTooLongError, KittenNameTooShortError } from '@/kittens/domain/errors';

export class KittenName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  public static of(value: string): KittenName {
    const trimmedValue = value.trim();
    
    if (trimmedValue.length < 3) {
      throw new KittenNameTooShortError(trimmedValue);
    }

    if (trimmedValue.length > 30) {
      throw new KittenNameTooLongError(trimmedValue);
    }

    return new KittenName(trimmedValue);
  }

  toString(): string {
    return this._value;
  }
}
