/**
 * Base class for in-memory repositories used in tests
 */
export class InMemoryRepository<T extends { id: string }> {
  protected items: Map<string, T> = new Map();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async save(item: T): Promise<T> {
    this.items.set(item.id, item);
    return item;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async clear(): Promise<void> {
    this.items.clear();
  }

  givenExists(entities: T[]): void {
    entities.forEach(entity => {
      this.items.set(entity.id, entity);
    });
  }
}
