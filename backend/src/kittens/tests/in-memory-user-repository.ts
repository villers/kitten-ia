import { User, UserRepository } from '../application/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly users: Map<string, User> = new Map();

  givenExistingUsers(users: User[]): void {
    users.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
}
