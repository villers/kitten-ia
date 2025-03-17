import { KittenId } from '../value-objects/kitten-id.value-object';
import { UserId } from '../value-objects/user-id.value-object';
import { KittenName } from '../value-objects/kitten-name.value-object';
import { KittenStat } from '../value-objects/kitten-stat.value-object';
import { Experience } from '../value-objects/experience.value-object';
import { SkillPoints } from '../value-objects/skill-points.value-object';

interface KittenProps {
  id: KittenId;
  userId: UserId;
  name: KittenName;
  strength: KittenStat;
  agility: KittenStat;
  constitution: KittenStat;
  intelligence: KittenStat;
  experience: Experience;
  skillPoints: SkillPoints;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateKittenProps {
  name: string;
  userId: string;
  strength?: number;
  agility?: number;
  constitution?: number;
  intelligence?: number;
  experience?: number;
  skillPoints?: number;
  avatarUrl?: string;
}

interface AssignSkillPointsProps {
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
}

export class Kitten {
  private readonly _id: KittenId;
  private readonly _userId: UserId;
  private readonly _name: KittenName;
  private readonly _strength: KittenStat;
  private readonly _agility: KittenStat;
  private readonly _constitution: KittenStat;
  private readonly _intelligence: KittenStat;
  private readonly _experience: Experience;
  private readonly _skillPoints: SkillPoints;
  private readonly _avatarUrl?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(props: KittenProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._name = props.name;
    this._strength = props.strength;
    this._agility = props.agility;
    this._constitution = props.constitution;
    this._intelligence = props.intelligence;
    this._experience = props.experience;
    this._skillPoints = props.skillPoints;
    this._avatarUrl = props.avatarUrl;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): KittenId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get name(): KittenName {
    return this._name;
  }

  get strength(): KittenStat {
    return this._strength;
  }

  get agility(): KittenStat {
    return this._agility;
  }

  get constitution(): KittenStat {
    return this._constitution;
  }

  get intelligence(): KittenStat {
    return this._intelligence;
  }

  get experience(): Experience {
    return this._experience;
  }

  get skillPoints(): SkillPoints {
    return this._skillPoints;
  }

  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get level(): number {
    return this._experience.calculateLevel();
  }

  /**
   * Factory method to create a new kitten
   */
  public static create(props: CreateKittenProps): Kitten {
    const now = new Date();
    
    return new Kitten({
      id: KittenId.generate(),
      userId: new UserId(props.userId),
      name: new KittenName(props.name),
      strength: new KittenStat(props.strength || 5),
      agility: new KittenStat(props.agility || 5),
      constitution: new KittenStat(props.constitution || 5),
      intelligence: new KittenStat(props.intelligence || 5),
      experience: new Experience(props.experience || 0),
      skillPoints: new SkillPoints(props.skillPoints || 0),
      avatarUrl: props.avatarUrl,
      createdAt: now,
      updatedAt: now
    });
  }

  /**
   * Add experience to the kitten and handle level-up logic
   */
  public addExperience(amount: number): Kitten {
    const currentLevel = this.level;
    const newExperience = this._experience.add(amount);
    const newLevel = newExperience.calculateLevel();
    
    // If kitten leveled up, add skill points
    let newSkillPoints = this._skillPoints;
    if (newLevel > currentLevel) {
      const pointsToAdd = newLevel - currentLevel;
      newSkillPoints = newSkillPoints.add(pointsToAdd);
    }

    return new Kitten({
      ...this.toObject(),
      experience: newExperience,
      skillPoints: newSkillPoints,
      updatedAt: new Date()
    });
  }

  /**
   * Assign skill points to attributes
   */
  public assignSkillPoints(points: AssignSkillPointsProps): Kitten {
    const totalPoints = points.strength + points.agility + points.constitution + points.intelligence;
    
    if (!this._skillPoints.hasEnough(totalPoints)) {
      throw new Error('Not enough skill points available');
    }

    return new Kitten({
      ...this.toObject(),
      strength: this._strength.increment(points.strength),
      agility: this._agility.increment(points.agility),
      constitution: this._constitution.increment(points.constitution),
      intelligence: this._intelligence.increment(points.intelligence),
      skillPoints: this._skillPoints.subtract(totalPoints),
      updatedAt: new Date()
    });
  }

  /**
   * Calculate kitten's health based on level and constitution
   */
  public calculateHealth(): number {
    const baseHealth = 50;
    const constitutionBonus = this.level * this._constitution.value;
    return baseHealth + constitutionBonus;
  }

  /**
   * Calculate kitten's base damage
   */
  public calculateBaseDamage(): number {
    return this._strength.value * 2;
  }

  /**
   * Convert the entity to a plain object
   */
  private toObject(): KittenProps {
    return {
      id: this._id,
      userId: this._userId,
      name: this._name,
      strength: this._strength,
      agility: this._agility,
      constitution: this._constitution,
      intelligence: this._intelligence,
      experience: this._experience,
      skillPoints: this._skillPoints,
      avatarUrl: this._avatarUrl,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}