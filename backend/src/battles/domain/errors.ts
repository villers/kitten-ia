export class BattleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BattleError';
  }
}

export class BattleNotFoundError extends BattleError {
  constructor(id: string) {
    super(`Battle with ID ${id} not found`);
    this.name = 'BattleNotFoundError';
  }
}

export class KittenNotFoundError extends BattleError {
  constructor(id: string) {
    super(`Kitten with ID ${id} not found`);
    this.name = 'KittenNotFoundError';
  }
}

export class ForbiddenBattleError extends BattleError {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenBattleError';
  }
}

export class SelfBattleError extends BattleError {
  constructor() {
    super('A kitten cannot battle against itself');
    this.name = 'SelfBattleError';
  }
}

export class NotOwnerError extends BattleError {
  constructor() {
    super('You can only battle with your own kittens');
    this.name = 'NotOwnerError';
  }
}