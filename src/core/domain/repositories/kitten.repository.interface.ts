import { Kitten } from '../entities/kitten.entity';
import { KittenId } from '../value-objects/kitten-id.value-object';
import { UserId } from '../value-objects/user-id.value-object';

export interface IKittenRepository {
  /**
   * Find a kitten by its ID
   */
  findById(id: KittenId): Promise<Kitten | null>;

  /**
   * Find all kittens belonging to a user
   */
  findByUserId(userId: UserId): Promise<Kitten[]>;

  /**
   * Find all kittens
   */
  findAll(): Promise<Kitten[]>;

  /**
   * Save a kitten (create or update)
   */
  save(kitten: Kitten): Promise<Kitten>;

  /**
   * Delete a kitten
   */
  delete(id: KittenId): Promise<void>;

  /**
   * Check if a kitten with the same name already exists for the user
   */
  existsByNameAndUserId(name: string, userId: UserId): Promise<boolean>;
}