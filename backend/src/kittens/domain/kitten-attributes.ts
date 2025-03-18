import { AttributeValue } from '@/kittens/domain/attribute-value';

export class KittenAttributes {
  private static readonly BASE_HP = 50;
  private static readonly CON_MULTIPLIER = 8;
  private static readonly LEVEL_MULTIPLIER = 5;

  constructor(
    private readonly _strength: AttributeValue,
    private readonly _agility: AttributeValue,
    private readonly _constitution: AttributeValue,
    private readonly _intelligence: AttributeValue
  ) {}

  get strength(): AttributeValue {
    return this._strength;
  }

  get agility(): AttributeValue {
    return this._agility;
  }

  get constitution(): AttributeValue {
    return this._constitution;
  }

  get intelligence(): AttributeValue {
    return this._intelligence;
  }

  public static createDefault(): KittenAttributes {
    return new KittenAttributes(
      AttributeValue.of(5),
      AttributeValue.of(5),
      AttributeValue.of(5),
      AttributeValue.of(5)
    );
  }

  public static validateSkillPoints(
    availablePoints: number,
    strength: number,
    agility: number,
    constitution: number,
    intelligence: number
  ): boolean {
    const total = strength + agility + constitution + intelligence;
    return total <= availablePoints;
  }

  public calculateHP(level: number): number {
    return KittenAttributes.BASE_HP + 
      (this._constitution.value * KittenAttributes.CON_MULTIPLIER) + 
      (level * KittenAttributes.LEVEL_MULTIPLIER);
  }

  public addSkillPoints(
    strength: number,
    agility: number,
    constitution: number,
    intelligence: number
  ): KittenAttributes {
    return new KittenAttributes(
      this._strength.add(strength),
      this._agility.add(agility),
      this._constitution.add(constitution),
      this._intelligence.add(intelligence)
    );
  }

  toJSON() {
    return {
      strength: this._strength.value,
      agility: this._agility.value,
      constitution: this._constitution.value,
      intelligence: this._intelligence.value
    };
  }
}
