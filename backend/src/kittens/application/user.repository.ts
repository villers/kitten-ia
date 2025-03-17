export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
}
