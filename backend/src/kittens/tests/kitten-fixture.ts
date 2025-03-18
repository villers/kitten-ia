import { Kitten } from '@/kittens/domain/kitten';
import { User } from '@/kittens/application/user.repository';
import { InMemoryKittenRepository } from '@/kittens/tests/in-memory-kitten-repository';
import { InMemoryUserRepository } from '@/kittens/tests/in-memory-user-repository';

export class KittenFixture {
  private readonly kittenRepository = new InMemoryKittenRepository();
  private readonly userRepository = new InMemoryUserRepository();
  private readonly error: Error | null = null;
  private readonly result: any = null;
  private date: Date = new Date('2024-01-01T00:00:00Z');

  givenKittenExists(kittens: Kitten[]): void {
    this.kittenRepository.givenExistingKittens(kittens);
  }

  givenUserExists(users: User[]): void {
    this.userRepository.givenExistingUsers(users);
  }

  givenCurrentDate(date: Date): void {
    this.date = date;
  }

  getError(): Error | null {
    return this.error;
  }

  getResult(): any {
    return this.result;
  }

  getKittenRepository(): InMemoryKittenRepository {
    return this.kittenRepository;
  }

  getUserRepository(): InMemoryUserRepository {
    return this.userRepository;
  }

  getCurrentDate(): Date {
    return this.date;
  }

  thenErrorShouldBeInstanceOf(errorClass: new (...args: any[]) => Error): void {
    expect(this.error).toBeInstanceOf(errorClass);
  }

  thenErrorMessageShouldContain(text: string): void {
    expect(this.error?.message).toContain(text);
  }

  thenKittenShouldMatchProperties(properties: Partial<Kitten>): void {
    for (const [key, value] of Object.entries(properties)) {
      expect(this.result[key]).toEqual(value);
    }
  }

  thenResultShouldBeInstanceOf(klass: any): void {
    expect(this.result).toBeInstanceOf(klass);
  }

  thenKittenShouldBe(expected: Kitten): void {
    expect(JSON.stringify(this.result)).toEqual(JSON.stringify(expected));
  }
}

export const createKittenFixture = (): KittenFixture => {
  return new KittenFixture();
};

// Fixture types for specific use cases will be created for each use case
