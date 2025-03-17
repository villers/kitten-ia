import { KittenEntity } from '../entities/kitten.entity';

export interface KittenRepository {
  findById(id: string): Promise<KittenEntity | null>;
  findByUserId(userId: string): Promise<KittenEntity[]>;
  findByName(name: string): Promise<KittenEntity | null>;
  save(kitten: KittenEntity): Promise<KittenEntity>;
  delete(id: string): Promise<void>;
  updateExperience(id: string, experienceToAdd: number): Promise<KittenEntity>;
  levelUp(id: string): Promise<KittenEntity>;
  assignSkillPoints(id: string, skillPoints: {
    strength: number;
    agility: number;
    constitution: number;
    intelligence: number;
  }): Promise<KittenEntity>;
}
