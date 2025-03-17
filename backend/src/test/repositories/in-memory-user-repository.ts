import { User } from '@prisma/client';
import { InMemoryRepository } from './in-memory-repository';

export class InMemoryUserRepository extends InMemoryRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.items.values());
    return users.find(user => user.email === email) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = Array.from(this.items.values());
    return users.find(user => user.username === username) || null;
  }
}
