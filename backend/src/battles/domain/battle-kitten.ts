export class BattleAbility {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _type: string,
    private readonly _power: number,
    private readonly _accuracy: number,
    private readonly _cooldown: number,
    private readonly _currentCooldown: number
  ) {}

  static create(
    id: string,
    name: string,
    description: string,
    type: string,
    power: number,
    accuracy: number,
    cooldown: number,
    currentCooldown = 0,
  ): BattleAbility {
    return new BattleAbility(
      id,
      name,
      description,
      type,
      power,
      accuracy,
      cooldown,
      currentCooldown
    );
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

  get type(): string {
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

  get currentCooldown(): number {
    return this._currentCooldown;
  }

  setCooldown(value: number): BattleAbility {
    return new BattleAbility(
      this._id,
      this._name,
      this._description,
      this._type,
      this._power,
      this._accuracy,
      this._cooldown,
      value
    );
  }

  decrementCooldown(): BattleAbility {
    if (this._currentCooldown <= 0) {
      return this;
    }
    return this.setCooldown(this._currentCooldown - 1);
  }

  resetCooldown(): BattleAbility {
    return this.setCooldown(this._cooldown);
  }

  isAvailable(): boolean {
    return this._currentCooldown === 0;
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
      currentCooldown: this._currentCooldown
    };
  }
}

export class BattleKitten {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _level: number,
    private readonly _strength: number,
    private readonly _agility: number,
    private readonly _constitution: number,
    private readonly _intelligence: number,
    private readonly _maxHealth: number,
    private readonly _currentHealth: number,
    private readonly _abilities: ReadonlyArray<BattleAbility>
  ) {}

  static create(
    id: string,
    name: string,
    level: number,
    strength: number,
    agility: number,
    constitution: number,
    intelligence: number,
    maxHealth?: number,
    currentHealth?: number,
    abilities: BattleAbility[] = [],
  ): BattleKitten {
    const calculatedMaxHealth = maxHealth || BattleKitten.calculateMaxHealth(constitution, level);
    const initialHealth = currentHealth || calculatedMaxHealth;

    return new BattleKitten(
      id,
      name,
      level,
      strength,
      agility,
      constitution,
      intelligence,
      calculatedMaxHealth,
      initialHealth,
      [...abilities]
    );
  }

  private static calculateMaxHealth(constitution: number, level: number): number {
    return 50 + (constitution * 10) + (level * 5);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get level(): number {
    return this._level;
  }

  get strength(): number {
    return this._strength;
  }

  get agility(): number {
    return this._agility;
  }

  get constitution(): number {
    return this._constitution;
  }

  get intelligence(): number {
    return this._intelligence;
  }

  get maxHealth(): number {
    return this._maxHealth;
  }

  get currentHealth(): number {
    return this._currentHealth;
  }

  get abilities(): ReadonlyArray<BattleAbility> {
    return this._abilities;
  }

  takeDamage(damage: number): BattleKitten {
    const newHealth = Math.max(0, this._currentHealth - damage);
    return this.withHealth(newHealth);
  }

  heal(amount: number): BattleKitten {
    const newHealth = Math.min(this._maxHealth, this._currentHealth + amount);
    return this.withHealth(newHealth);
  }

  private withHealth(health: number): BattleKitten {
    return new BattleKitten(
      this._id,
      this._name,
      this._level,
      this._strength,
      this._agility,
      this._constitution,
      this._intelligence,
      this._maxHealth,
      health,
      this._abilities
    );
  }

  withAbilities(abilities: BattleAbility[]): BattleKitten {
    return new BattleKitten(
      this._id,
      this._name,
      this._level,
      this._strength,
      this._agility,
      this._constitution,
      this._intelligence,
      this._maxHealth,
      this._currentHealth,
      abilities
    );
  }

  updateAbility(updatedAbility: BattleAbility): BattleKitten {
    const updatedAbilities = this._abilities.map(ability => 
      ability.id === updatedAbility.id ? updatedAbility : ability
    );
    
    return this.withAbilities(updatedAbilities);
  }

  updateAllAbilitiesCooldowns(): BattleKitten {
    const updatedAbilities = this._abilities.map(ability => 
      ability.decrementCooldown()
    );
    
    return this.withAbilities(updatedAbilities);
  }

  isDead(): boolean {
    return this._currentHealth <= 0;
  }

  getAvailableAbilities(): BattleAbility[] {
    return this._abilities.filter(ability => ability.isAvailable());
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      level: this._level,
      strength: this._strength,
      agility: this._agility,
      constitution: this._constitution,
      intelligence: this._intelligence,
      maxHealth: this._maxHealth,
      currentHealth: this._currentHealth,
      abilities: this._abilities.map(ability => ability.toJSON())
    };
  }
}