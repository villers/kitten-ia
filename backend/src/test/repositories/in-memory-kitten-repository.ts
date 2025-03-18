import { Kitten } from '@prisma/client';
import { InMemoryRepository } from '@/test/repositories/in-memory-repository';

export class InMemoryKittenRepository extends InMemoryRepository<Kitten> {
  async findByUserId(userId: string): Promise<Kitten[]> {
    const kittens = Array.from(this.items.values());
    return kittens.filter(kitten => kitten.userId === userId);
  }

  async findByName(name: string): Promise<Kitten | null> {
    const kittens = Array.from(this.items.values());
    return kittens.find(kitten => kitten.name === name) || null;
  }

  async updateExperience(id: string, experienceToAdd: number): Promise<Kitten> {
    const kitten = await this.findById(id);
    if (!kitten) {
      throw new Error(`Kitten with ID ${id} not found`);
    }

    const updatedKitten = {
      ...kitten,
      experience: kitten.experience + experienceToAdd,
    };

    await this.save(updatedKitten);
    return updatedKitten;
  }

  async levelUp(id: string): Promise<Kitten> {
    const kitten = await this.findById(id);
    if (!kitten) {
      throw new Error(`Kitten with ID ${id} not found`);
    }

    const updatedKitten = {
      ...kitten,
      level: kitten.level + 1,
      skillPoints: kitten.skillPoints + 5,
    };

    await this.save(updatedKitten);
    return updatedKitten;
  }
}
