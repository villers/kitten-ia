import { KittenRepository } from '../application/kitten.repository';
import { Kitten } from '../domain/kitten';

export class InMemoryKittenRepository implements KittenRepository {
  private readonly kittens: Map<string, Kitten> = new Map();

  givenExistingKittens(kittens: Kitten[]): void {
    kittens.forEach(kitten => {
      this.kittens.set(kitten.id, kitten);
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
    return kitten;
  }

  async delete(id: string): Promise<void> {
    this.kittens.delete(id);
  }
}
