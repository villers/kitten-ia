import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.value-object';

export interface IUserRepository {
  /**
   * Find a user by ID
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Find a user by username
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Save a user (create or update)
   */
  save(user: User): Promise<User>;

  /**
   * Delete a user
   */
  delete(id: UserId): Promise<void>;

  /**
   * Check if a username is already taken
   */
  existsByUsername(username: string): Promise<boolean>;

  /**
   * Check if an email is already taken
   */
  existsByEmail(email: string): Promise<boolean>;
}