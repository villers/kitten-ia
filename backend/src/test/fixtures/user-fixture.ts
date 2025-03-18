import { User } from '@prisma/client';
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository';
import { userBuilder } from '@/test/builders';

export class UserFixture {
  private readonly userRepository = new InMemoryUserRepository();
  private error: Error | null = null;
  private result: any = null;

  givenUserExists(users: User[]): void {
    this.userRepository.givenExists(users);
  }

  async whenFindUserById(id: string): Promise<void> {
    try {
      this.result = await this.userRepository.findById(id);
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenFindUserByEmail(email: string): Promise<void> {
    try {
      this.result = await this.userRepository.findByEmail(email);
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenFindUserByUsername(username: string): Promise<void> {
    try {
      this.result = await this.userRepository.findByUsername(username);
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenCreateUser(userData: Partial<User>): Promise<void> {
    try {
      const user = userBuilder(userData).build();
      this.result = await this.userRepository.save(user);
    } catch (error) {
      this.error = error as Error;
    }
  }

  thenUserShouldExist(expectedUser: User): void {
    expect(this.result).toEqual(expectedUser);
  }

  thenUserShouldNotBeFound(): void {
    expect(this.result).toBeNull();
  }

  thenErrorShouldBe(expectedErrorClass: new () => Error): void {
    expect(this.error).toBeInstanceOf(expectedErrorClass);
  }

  thenErrorMessageShouldContain(text: string): void {
    expect(this.error?.message).toContain(text);
  }

  getRepository(): InMemoryUserRepository {
    return this.userRepository;
  }
}

export const createUserFixture = (): UserFixture => {
  return new UserFixture();
};
