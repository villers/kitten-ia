import { User } from '@prisma/client';

interface UserOptions {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userBuilder = ({
  id = 'user-id-1',
  username = 'testuser',
  email = 'test@example.com',
  password = 'hashedpassword',
  createdAt = new Date(),
  updatedAt = new Date(),
}: UserOptions = {}) => {
  const props = {
    id,
    username,
    email,
    password,
    createdAt,
    updatedAt,
  };

  return {
    withId(_id: string) {
      return userBuilder({ ...props, id: _id });
    },

    withUsername(_username: string) {
      return userBuilder({ ...props, username: _username });
    },

    withEmail(_email: string) {
      return userBuilder({ ...props, email: _email });
    },

    withPassword(_password: string) {
      return userBuilder({ ...props, password: _password });
    },

    withCreatedAt(_createdAt: Date) {
      return userBuilder({ ...props, createdAt: _createdAt });
    },

    withUpdatedAt(_updatedAt: Date) {
      return userBuilder({ ...props, updatedAt: _updatedAt });
    },

    build(): User {
      return {
        id: props.id,
        username: props.username,
        email: props.email,
        password: props.password,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      };
    },
  };
};
