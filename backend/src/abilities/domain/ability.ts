import { AbilityType } from '@prisma/client';
import { AbilityNameTooShortError, AbilityNameTooLongError, InvalidPowerValueError, InvalidAccuracyValueError, InvalidCooldownValueError } from '@/abilities/domain/errors';

export class Ability {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _type: AbilityType,
    private readonly _power: number,
    private readonly _accuracy: number,
    private readonly _cooldown: number,
    private readonly _kittenId: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {
    this.validateName(_name);
    this.validatePower(_power);
    this.validateAccuracy(_accuracy);
    this.validateCooldown(_cooldown);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get type(): AbilityType {
    return this._type;
  }

  get power(): number {
    return this._power;
  }

  get accuracy(): number {
    return this._accuracy;
  }

  get cooldown(): number {
    return this._cooldown;
  }

  get kittenId(): string {
    return this._kittenId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validateName(name: string): void {
    if (name.length < 3) {
      throw new AbilityNameTooShortError(name);
    }

    if (name.length > 50) {
      throw new AbilityNameTooLongError(name);
    }
  }

  private validatePower(power: number): void {
    if (power < 1 || power > 100) {
      throw new InvalidPowerValueError(power);
    }
  }

  private validateAccuracy(accuracy: number): void {
    if (accuracy < 1 || accuracy > 100) {
      throw new InvalidAccuracyValueError(accuracy);
    }
  }

  private validateCooldown(cooldown: number): void {
    if (cooldown < 0 || cooldown > 10) {
      throw new InvalidCooldownValueError(cooldown);
    }
  }

  update(
    name?: string,
    description?: string,
    type?: AbilityType,
    power?: number,
    accuracy?: number,
    cooldown?: number
  ): Ability {
    // Valider les nouveaux champs si fournis
    if (name) this.validateName(name);
    if (power !== undefined) this.validatePower(power);
    if (accuracy !== undefined) this.validateAccuracy(accuracy);
    if (cooldown !== undefined) this.validateCooldown(cooldown);

    return new Ability(
      this._id,
      name ?? this._name,
      description ?? this._description,
      type ?? this._type,
      power ?? this._power,
      accuracy ?? this._accuracy,
      cooldown ?? this._cooldown,
      this._kittenId,
      this._createdAt,
      new Date()
    );
  }

  belongsToKitten(kittenId: string): boolean {
    return this._kittenId === kittenId;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      type: this._type,
      power: this._power,
      accuracy: this._accuracy,
      cooldown: this._cooldown,
      kittenId: this._kittenId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
