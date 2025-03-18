import { Kitten, KittenStats } from '@prisma/client';
import { userBuilder } from '@/test/builders/user.builder';

interface KittenOptions {
  id?: string;
  name?: string;
  level?: number;
  experience?: number;
  strength?: number;
  agility?: number;
  constitution?: number;
  intelligence?: number;
  skillPoints?: number;
  avatarUrl?: string | null;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  stats?: KittenStats | null;
}

export const kittenBuilder = ({
  id = 'kitten-id-1',
  name = 'Test Kitten',
  level = 1,
  experience = 0,
  strength = 5,
  agility = 5,
  constitution = 5,
  intelligence = 5,
  skillPoints = 0,
  avatarUrl = null,
  userId = userBuilder().build().id,
  createdAt = new Date(),
  updatedAt = new Date(),
  stats = null,
}: KittenOptions = {}) => {
  const props = {
    id,
    name,
    level,
    experience,
    strength,
    agility,
    constitution,
    intelligence,
    skillPoints,
    avatarUrl,
    userId,
    createdAt,
    updatedAt,
    stats,
  };

  return {
    withId(_id: string) {
      return kittenBuilder({ ...props, id: _id });
    },

    withName(_name: string) {
      return kittenBuilder({ ...props, name: _name });
    },

    withLevel(_level: number) {
      return kittenBuilder({ ...props, level: _level });
    },

    withExperience(_experience: number) {
      return kittenBuilder({ ...props, experience: _experience });
    },

    withStrength(_strength: number) {
      return kittenBuilder({ ...props, strength: _strength });
    },

    withAgility(_agility: number) {
      return kittenBuilder({ ...props, agility: _agility });
    },

    withConstitution(_constitution: number) {
      return kittenBuilder({ ...props, constitution: _constitution });
    },

    withIntelligence(_intelligence: number) {
      return kittenBuilder({ ...props, intelligence: _intelligence });
    },

    withSkillPoints(_skillPoints: number) {
      return kittenBuilder({ ...props, skillPoints: _skillPoints });
    },

    withAvatarUrl(_avatarUrl: string | null) {
      return kittenBuilder({ ...props, avatarUrl: _avatarUrl });
    },

    withUserId(_userId: string) {
      return kittenBuilder({ ...props, userId: _userId });
    },

    withCreatedAt(_createdAt: Date) {
      return kittenBuilder({ ...props, createdAt: _createdAt });
    },

    withUpdatedAt(_updatedAt: Date) {
      return kittenBuilder({ ...props, updatedAt: _updatedAt });
    },

    withStats(_stats: KittenStats | null) {
      return kittenBuilder({ ...props, stats: _stats });
    },

    build(): Kitten {
      return {
        id: props.id,
        name: props.name,
        level: props.level,
        experience: props.experience,
        strength: props.strength,
        agility: props.agility,
        constitution: props.constitution,
        intelligence: props.intelligence,
        skillPoints: props.skillPoints,
        avatarUrl: props.avatarUrl,
        userId: props.userId,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      };
    },
  };
};
