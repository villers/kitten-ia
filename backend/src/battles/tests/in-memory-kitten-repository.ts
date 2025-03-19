import { KittenRepository } from '@/battles/application/kitten.repository';
import { BattleKitten } from '@/battles/domain/battle-kitten';

export class InMemoryKittenRepository implements KittenRepository {
  private kittens: Map<string, BattleKitten> = new Map();
  private owners: Map<string, string> = new Map(); // Map<kittenId, userId>
  
  // Pour les assertions de test
  public updateStatsWasCalled = false;
  public updateExperienceWasCalled = false;

  async findById(id: string): Promise<BattleKitten | null> {
    return this.kittens.get(id) || null;
  }

  async updateExperience(kittenId: string, experienceGain: number): Promise<void> {
    this.updateExperienceWasCalled = true;
    // Dans une implémentation réelle, nous mettrions à jour l'expérience
  }

  async updateStats(winnerId: string, loserId: string): Promise<void> {
    this.updateStatsWasCalled = true;
    // Dans une implémentation réelle, nous mettrions à jour les statistiques
  }

  async isOwner(kittenId: string, userId: string): Promise<boolean> {
    return this.owners.get(kittenId) === userId;
  }

  // Helpers for testing
  addKitten(kitten: BattleKitten, userId: string): void {
    // Add properties to match required structure in convertToBattleKitten
    const enhancedKitten = {
      ...kitten,
      strength: kitten.strength,
      agility: kitten.agility,
      constitution: kitten.constitution,
      intelligence: kitten.intelligence
    };
    this.kittens.set(kitten.id, enhancedKitten as BattleKitten);
    this.owners.set(kitten.id, userId);
  }

  reset(): void {
    this.kittens.clear();
    this.owners.clear();
    this.updateStatsWasCalled = false;
    this.updateExperienceWasCalled = false;
  }
}