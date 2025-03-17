export class AttributeValue {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  public static of(value: number): AttributeValue {
    // Convert to integer
    const intValue = Math.floor(value);
    
    if (intValue < 1 || intValue > 20) {
      throw new Error('Attribute value must be between 1 and 20');
    }

    return new AttributeValue(intValue);
  }

  add(value: number): AttributeValue {
    return AttributeValue.of(this._value + value);
  }

  equals(other: AttributeValue): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value.toString();
  }
}
