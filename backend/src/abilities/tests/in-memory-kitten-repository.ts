import { KittenRepository } from '@/abilities/application/kitten.repository';

export class InMemoryKittenRepository implements KittenRepository {
  private kittens: Array<{ id: string, userId: string }> = [];

  async findById(id: string): Promise<{ id: string, userId: string } | null> {
    const kitten = this.kittens.find(k => k.id === id);
    return kitten || null;
  }

  async isKittenOwnedByUser(kittenId: string, userId: string): Promise<boolean> {
    const kitten = await this.findById(kittenId);
    
    if (!kitten) {
      return false;
    }
    
    return kitten.userId === userId;
  }

  clear(): void {
    this.kittens = [];
  }

  addKitten(kitten: { id: string, userId: string }): void {
    this.kittens.push(kitten);
  }
}
