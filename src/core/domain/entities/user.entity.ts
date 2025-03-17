import { UserId } from '../value-objects/user-id.value-object';

interface UserProps {
  id: UserId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserProps {
  username: string;
  email: string;
  password: string;
}

export class User {
  private readonly _id: UserId;
  private readonly _username: string;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): UserId {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Factory method to create a new user
   */
  public static create(props: CreateUserProps): User {
    User.validateUsername(props.username);
    User.validateEmail(props.email);

    const now = new Date();
    
    return new User({
      id: UserId.generate(),
      username: props.username,
      email: props.email,
      password: props.password,
      createdAt: now,
      updatedAt: now
    });
  }

  /**
   * Update user's email
   */
  public updateEmail(email: string): User {
    User.validateEmail(email);

    return new User({
      ...this.toObject(),
      email,
      updatedAt: new Date()
    });
  }

  /**
   * Update user's password
   */
  public updatePassword(password: string): User {
    return new User({
      ...this.toObject(),
      password,
      updatedAt: new Date()
    });
  }

  /**
   * Validate username format
   */
  private static validateUsername(username: string): void {
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (username.length > 50) {
      throw new Error('Username cannot exceed 50 characters');
    }
  }

  /**
   * Validate email format
   */
  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * Convert the entity to a plain object
   */
  private toObject(): UserProps {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      password: this._password,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}