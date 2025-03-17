export class KittenNameTooShortError extends Error {
  constructor(name: string) {
    super(`Kitten name "${name}" is too short. Minimum length is 3 characters.`);
    this.name = 'KittenNameTooShortError';
  }
}

export class KittenNameTooLongError extends Error {
  constructor(name: string) {
    super(`Kitten name "${name}" is too long. Maximum length is 30 characters.`);
    this.name = 'KittenNameTooLongError';
  }
}

export class UserNotFoundForKittenCreationError extends Error {
  constructor(userId: string) {
    super(`User with ID ${userId} not found for kitten creation`);
    this.name = 'UserNotFoundForKittenCreationError';
  }
}

export class KittenNameAlreadyExistError extends Error {
  constructor(name: string) {
    super(`Kitten with name ${name} already exists`);
    this.name = 'KittenNameAlreadyExistError';
  }
}

export class KittenNotFoundError extends Error {
  constructor(id: string) {
    super(`Kitten with ID ${id} not found`);
    this.name = 'KittenNotFoundError';
  }
}

export class NotEnoughSkillPointsError extends Error {
  constructor(available: number, required: number) {
    super(`Not enough skill points available. You have ${available} points but need ${required}`);
    this.name = 'NotEnoughSkillPointsError';
  }
}

export class NotKittenOwnerError extends Error {
  constructor() {
    super('You can only update your own kittens');
    this.name = 'NotKittenOwnerError';
  }
}
