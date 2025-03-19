import { KittenRepository } from '@/kittens/application/kitten.repository';
import { Kitten } from '@/kittens/domain/kitten';

export class InMemoryKittenRepository implements KittenRepository {
  private readonly kittens: Map<string, Kitten> = new Map();
  private readonly owners: Map<string, string> = new Map(); // Map<kittenId, userId>

  // Pour les assertions de test
  public updateStatsWasCalled = false;
  public updateExperienceWasCalled = false;

  givenExistingKittens(kittens: Kitten[]): void {
    kittens.forEach(kitten => {
      this.kittens.set(kitten.id, kitten);
      this.owners.set(kitten.id, kitten.userId);
    });
  }

  async findById(id: string): Promise<Kitten | null> {
    return this.kittens.get(id) || null;
  }

  async findByName(name: string): Promise<Kitten | null> {
    for (const kitten of this.kittens.values()) {
      if (kitten.name.value === name) {
        return kitten;
      }
    }
    return null;
  }

  async findByUserId(userId: string): Promise<Kitten[]> {
    return Array.from(this.kittens.values()).filter(
      kitten => kitten.userId === userId
    );
  }

  async findAll(): Promise<Kitten[]> {
    return Array.from(this.kittens.values());
  }

  async save(kitten: Kitten): Promise<Kitten> {
    this.kittens.set(kitten.id, kitten);
    this.owners.set(kitten.id, kitten.userId);
    return kitten;
  }

  async delete(id: string): Promise<void> {
    this.kittens.delete(id);
    this.owners.delete(id);
  }

  async isOwner(kittenId: string, userId: string): Promise<boolean> {
    return this.owners.get(kittenId) === userId;
  }

  async updateStats(winnerId: string, loserId: string): Promise<void> {
    this.updateStatsWasCalled = true;
    // Dans une implémentation réelle, nous mettrions à jour les statistiques
  }

  async updateExperience(kittenId: string, experienceGain: number): Promise<void> {
    this.updateExperienceWasCalled = true;
    // Dans une implémentation réelle, nous mettrions à jour l'expérience
  }
}
