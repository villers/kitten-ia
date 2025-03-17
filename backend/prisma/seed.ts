import { PrismaClient, AbilityType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Nettoyage de la base de données
  await prisma.battleMove.deleteMany();
  await prisma.battleLog.deleteMany();
  await prisma.ability.deleteMany();
  await prisma.kittenStats.deleteMany();
  await prisma.kitten.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned');

  // Création des utilisateurs
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'user1@example.com',
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'user2@example.com',
      password: passwordHash,
    },
  });

  console.log('Users created');

  // Création des chatons pour l'utilisateur 1
  const kitten1 = await prisma.kitten.create({
    data: {
      name: 'Whiskers',
      strength: 8,
      agility: 7,
      constitution: 6,
      intelligence: 5,
      userId: user1.id,
      avatarUrl: 'https://placekitten.com/200/200',
    },
  });

  const kitten2 = await prisma.kitten.create({
    data: {
      name: 'Mittens',
      strength: 5,
      agility: 9,
      constitution: 5,
      intelligence: 7,
      userId: user1.id,
      avatarUrl: 'https://placekitten.com/201/201',
    },
  });

  // Création des chatons pour l'utilisateur 2
  const kitten3 = await prisma.kitten.create({
    data: {
      name: 'Shadow',
      strength: 9,
      agility: 6,
      constitution: 7,
      intelligence: 4,
      userId: user2.id,
      avatarUrl: 'https://placekitten.com/202/202',
    },
  });

  const kitten4 = await prisma.kitten.create({
    data: {
      name: 'Luna',
      strength: 4,
      agility: 8,
      constitution: 6,
      intelligence: 9,
      userId: user2.id,
      avatarUrl: 'https://placekitten.com/203/203',
    },
  });

  console.log('Kittens created');

  // Création des statistiques pour les chatons
  await prisma.kittenStats.create({
    data: {
      kittenId: kitten1.id,
      wins: 5,
      losses: 2,
      draws: 1,
    },
  });

  await prisma.kittenStats.create({
    data: {
      kittenId: kitten2.id,
      wins: 3,
      losses: 3,
      draws: 0,
    },
  });

  await prisma.kittenStats.create({
    data: {
      kittenId: kitten3.id,
      wins: 4,
      losses: 1,
      draws: 0,
    },
  });

  await prisma.kittenStats.create({
    data: {
      kittenId: kitten4.id,
      wins: 2,
      losses: 4,
      draws: 1,
    },
  });

  console.log('Kitten stats created');

  // Création des capacités pour les chatons
  // Capacités pour Whiskers
  await prisma.ability.create({
    data: {
      name: 'Scratch',
      description: 'A basic scratch attack',
      type: AbilityType.ATTACK,
      power: 20,
      accuracy: 95,
      cooldown: 0,
      kittenId: kitten1.id,
    },
  });

  await prisma.ability.create({
    data: {
      name: 'Fierce Bite',
      description: 'A powerful bite attack',
      type: AbilityType.ATTACK,
      power: 40,
      accuracy: 80,
      cooldown: 1,
      kittenId: kitten1.id,
    },
  });

  await prisma.ability.create({
    data: {
      name: 'Healing Purr',
      description: 'A soothing purr that heals wounds',
      type: AbilityType.HEAL,
      power: 30,
      accuracy: 100,
      cooldown: 3,
      kittenId: kitten1.id,
    },
  });

  // Capacités pour Mittens
  await prisma.ability.create({
    data: {
      name: 'Quick Swipe',
      description: 'A swift attack with claws',
      type: AbilityType.ATTACK,
      power: 15,
      accuracy: 98,
      cooldown: 0,
      kittenId: kitten2.id,
    },
  });

  await prisma.ability.create({
    data: {
      name: 'Agile Dodge',
      description: 'A defensive move that increases evasion',
      type: AbilityType.DEFENSE,
      power: 0,
      accuracy: 100,
      cooldown: 2,
      kittenId: kitten2.id,
    },
  });

  await prisma.ability.create({
    data: {
      name: 'Mind Games',
      description: 'A special attack that confuses the opponent',
      type: AbilityType.SPECIAL,
      power: 35,
      accuracy: 85,
      cooldown: 2,
      kittenId: kitten2.id,
    },
  });

  // Capacités pour Shadow
  await prisma.ability.create({
    data: {
      name: 'Pounce',
      description: 'A powerful jumping attack',
      type: AbilityType.ATTACK,
      power: 25,
      accuracy: 90,
      cooldown: 0,
      kittenId: kitten3.id,
    },
  });

  await prisma.ability.create({
    data: {
      name: 'Intimidate',
      description: 'A threatening growl that weakens the opponent',
      type: AbilityType.DEBUFF,
      power: 0,
      accuracy: 90,
      cooldown: 3,
      kittenId: kitten3.id,
    },
  });

  // Capacités pour Luna
  await prisma.ability.create({
    data: {
      name: 'Arcane Scratch',
      description: 'A magical scratch that bypasses defenses',
      type: AbilityType.SPECIAL,
      power: 30,
      accuracy: 85,
      cooldown: 1,
      kittenId: kitten4.id,
    },
  });

  await prisma.ability.create({
    data: {
      name: 'Enchanted Purr',
      description: 'A magical purr that boosts abilities',
      type: AbilityType.BUFF,
      power: 0,
      accuracy: 100,
      cooldown: 3,
      kittenId: kitten4.id,
    },
  });

  console.log('Abilities created');

  console.log('Seeding complete!');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
