import { Ability } from '@prisma/client';
import { InMemoryRepository } from '@/test/repositories/in-memory-repository';

export class InMemoryAbilityRepository extends InMemoryRepository<Ability> {
  async findByKittenId(kittenId: string): Promise<Ability[]> {
    const abilities = Array.from(this.items.values());
    return abilities.filter(ability => ability.kittenId === kittenId);
  }

  async findByName(name: string): Promise<Ability | null> {
    const abilities = Array.from(this.items.values());
    return abilities.find(ability => ability.name === name) || null;
  }

  async assignToKitten(abilityId: string, kittenId: string): Promise<Ability> {
    const ability = await this.findById(abilityId);
    if (!ability) {
      throw new Error(`Ability with ID ${abilityId} not found`);
    }

    const updatedAbility = {
      ...ability,
      kittenId,
    };

    await this.save(updatedAbility);
    return updatedAbility;
  }
}
