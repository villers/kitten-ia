import { Kitten } from '../domain/kitten';
import { KittenName } from '../domain/kitten-name';
import { KittenAttributes } from '../domain/kitten-attributes';
import { AttributeValue } from '../domain/attribute-value';

interface KittenBuilderOptions {
  id?: string;
  name?: string;
  userId?: string;
  level?: number;
  experience?: number;
  skillPoints?: number;
  strength?: number;
  agility?: number;
  constitution?: number;
  intelligence?: number;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const kittenBuilder = (options: KittenBuilderOptions = {}) => {
  const props = {
    id: options.id ?? 'kitten-id-1',
    name: options.name ?? 'Test Kitten',
    userId: options.userId ?? 'user-id-1',
    level: options.level ?? 1,
    experience: options.experience ?? 0,
    skillPoints: options.skillPoints ?? 0,
    strength: options.strength ?? 5,
    agility: options.agility ?? 5,
    constitution: options.constitution ?? 5,
    intelligence: options.intelligence ?? 5,
    avatarUrl: options.avatarUrl ?? null,
    createdAt: options.createdAt || new Date('2024-01-01T00:00:00Z'),
    updatedAt: options.updatedAt || new Date('2024-01-01T00:00:00Z'),
  };

  return {
    withId(id: string) {
      return kittenBuilder({ ...options, id });
    },

    withName(name: string) {
      return kittenBuilder({ ...options, name });
    },

    withUserId(userId: string) {
      return kittenBuilder({ ...options, userId });
    },

    withLevel(level: number) {
      return kittenBuilder({ ...options, level });
    },

    withExperience(experience: number) {
      return kittenBuilder({ ...options, experience });
    },

    withSkillPoints(skillPoints: number) {
      return kittenBuilder({ ...options, skillPoints });
    },

    withStrength(strength: number) {
      return kittenBuilder({ ...options, strength });
    },

    withAgility(agility: number) {
      return kittenBuilder({ ...options, agility });
    },

    withConstitution(constitution: number) {
      return kittenBuilder({ ...options, constitution });
    },

    withIntelligence(intelligence: number) {
      return kittenBuilder({ ...options, intelligence });
    },

    withAvatarUrl(avatarUrl: string | null) {
      return kittenBuilder({ ...options, avatarUrl });
    },

    withCreatedAt(createdAt: Date) {
      return kittenBuilder({ ...options, createdAt });
    },

    withUpdatedAt(updatedAt: Date) {
      return kittenBuilder({ ...options, updatedAt });
    },

    build(): Kitten {
      return new Kitten(
        props.id,
        KittenName.of(props.name),
        props.userId,
        props.level,
        props.experience,
        props.skillPoints,
        new KittenAttributes(
          AttributeValue.of(props.strength),
          AttributeValue.of(props.agility),
          AttributeValue.of(props.constitution),
          AttributeValue.of(props.intelligence)
        ),
        props.createdAt,
        props.updatedAt,
        props.avatarUrl
      );
    }
  };
};
