export class AbilityNameTooShortError extends Error {
  constructor(name: string) {
    super(`Ability name "${name}" is too short. Minimum length is 3 characters.`);
    this.name = 'AbilityNameTooShortError';
  }
}

export class AbilityNameTooLongError extends Error {
  constructor(name: string) {
    super(`Ability name "${name}" is too long. Maximum length is 50 characters.`);
    this.name = 'AbilityNameTooLongError';
  }
}

export class InvalidPowerValueError extends Error {
  constructor(power: number) {
    super(`Power value ${power} is invalid. It must be between 1 and 100.`);
    this.name = 'InvalidPowerValueError';
  }
}

export class InvalidAccuracyValueError extends Error {
  constructor(accuracy: number) {
    super(`Accuracy value ${accuracy} is invalid. It must be between 1 and 100.`);
    this.name = 'InvalidAccuracyValueError';
  }
}

export class InvalidCooldownValueError extends Error {
  constructor(cooldown: number) {
    super(`Cooldown value ${cooldown} is invalid. It must be between 0 and 10.`);
    this.name = 'InvalidCooldownValueError';
  }
}

export class AbilityNotFoundError extends Error {
  constructor(id: string) {
    super(`Ability with ID ${id} not found`);
    this.name = 'AbilityNotFoundError';
  }
}

export class KittenNotFoundError extends Error {
  constructor(id: string) {
    super(`Kitten with ID ${id} not found`);
    this.name = 'KittenNotFoundError';
  }
}

export class NotKittenOwnerError extends Error {
  constructor() {
    super('You can only perform operations on abilities for your own kittens');
    this.name = 'NotKittenOwnerError';
  }
}
