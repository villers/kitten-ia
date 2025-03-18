import { AbilityRepository } from '@/abilities/application/ability.repository';
import { Ability } from '@/abilities/domain/ability';

export class InMemoryAbilityRepository implements AbilityRepository {
  private abilities: Ability[] = [];

  async findById(id: string): Promise<Ability | null> {
    const ability = this.abilities.find(a => a.id === id);
    return ability || null;
  }

  async findByKittenId(kittenId: string): Promise<Ability[]> {
    return this.abilities.filter(a => a.kittenId === kittenId);
  }

  async findAll(): Promise<Ability[]> {
    return [...this.abilities];
  }

  async save(ability: Ability): Promise<Ability> {
    const existingIndex = this.abilities.findIndex(a => a.id === ability.id);
    
    if (existingIndex >= 0) {
      this.abilities[existingIndex] = ability;
    } else {
      this.abilities.push(ability);
    }
    
    return ability;
  }

  async delete(id: string): Promise<void> {
    const index = this.abilities.findIndex(a => a.id === id);
    
    if (index >= 0) {
      this.abilities.splice(index, 1);
    }
  }

  clear(): void {
    this.abilities = [];
  }

  addAbility(ability: Ability): void {
    this.abilities.push(ability);
  }
}
