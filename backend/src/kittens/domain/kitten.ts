import { KittenName } from '@/kittens/domain/kitten-name';
import { KittenAttributes } from '@/kittens/domain/kitten-attributes';
import { NotEnoughSkillPointsError } from '@/kittens/domain/errors';

export class Kitten {
  constructor(
    private readonly _id: string,
    private readonly _name: KittenName,
    private readonly _userId: string,
    private readonly _level: number,
    private readonly _experience: number,
    private readonly _skillPoints: number,
    private readonly _attributes: KittenAttributes,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _avatarUrl?: string | null
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): KittenName {
    return this._name;
  }

  get userId(): string {
    return this._userId;
  }

  get level(): number {
    return this._level;
  }

  get experience(): number {
    return this._experience;
  }

  get skillPoints(): number {
    return this._skillPoints;
  }

  get attributes(): KittenAttributes {
    return this._attributes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get avatarUrl(): string | null | undefined {
    return this._avatarUrl;
  }

  getHP(): number {
    return this._attributes.calculateHP(this._level);
  }

  isOwnedBy(userId: string): boolean {
    return this._userId === userId;
  }

  assignSkillPoints(
    strength: number,
    agility: number,
    constitution: number,
    intelligence: number
  ): Kitten {
    const totalPoints = strength + agility + constitution + intelligence;
    
    if (totalPoints > this._skillPoints) {
      throw new NotEnoughSkillPointsError(this._skillPoints, totalPoints);
    }

    const updatedAttributes = this._attributes.addSkillPoints(
      strength,
      agility,
      constitution,
      intelligence
    );

    return new Kitten(
      this._id,
      this._name,
      this._userId,
      this._level,
      this._experience,
      this._skillPoints - totalPoints,
      updatedAttributes,
      this._createdAt,
      new Date(),
      this._avatarUrl
    );
  }

  update(
    name?: string,
    avatarUrl?: string | null
  ): Kitten {
    return new Kitten(
      this._id,
      name ? KittenName.of(name) : this._name,
      this._userId,
      this._level,
      this._experience,
      this._skillPoints,
      this._attributes,
      this._createdAt,
      new Date(),
      avatarUrl !== undefined ? avatarUrl : this._avatarUrl
    );
  }

  addExperience(experience: number): Kitten {
    return new Kitten(
      this._id,
      this._name,
      this._userId,
      this._level,
      this._experience + experience,
      this._skillPoints,
      this._attributes,
      this._createdAt,
      new Date(),
      this._avatarUrl
    );
  }

  levelUp(skillPointsPerLevel: number = 5): Kitten {
    return new Kitten(
      this._id,
      this._name,
      this._userId,
      this._level + 1,
      this._experience,
      this._skillPoints + skillPointsPerLevel,
      this._attributes,
      this._createdAt,
      new Date(),
      this._avatarUrl
    );
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name.toString(),
      userId: this._userId,
      level: this._level,
      experience: this._experience,
      skillPoints: this._skillPoints,
      hp: this.getHP(),
      ...this._attributes.toJSON(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      avatarUrl: this._avatarUrl,
      abilities: [] // Ajout temporaire pour la compatibilité avec le frontend
    };
  }
}
