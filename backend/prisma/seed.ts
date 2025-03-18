import { PrismaClient, AbilityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si la capacité par défaut existe déjà
  const defaultAbility = await prisma.ability.findUnique({
    where: { id: '00000000-0000-0000-0000-000000000000' },
  });

  // Si la capacité par défaut n'existe pas, la créer
  if (!defaultAbility) {
    // Créer un utilisateur par défaut si nécessaire
    let defaultUser = await prisma.user.findUnique({
      where: { username: 'system' },
    });

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          username: 'system',
          email: 'system@example.com',
          password: 'system', // Ne sera jamais utilisé
        },
      });
    }

    // Créer un chaton par défaut si nécessaire
    let defaultKitten = await prisma.kitten.findFirst({
      where: { userId: defaultUser.id },
    });

    if (!defaultKitten) {
      defaultKitten = await prisma.kitten.create({
        data: {
          name: 'System Kitten',
          userId: defaultUser.id,
        },
      });
    }

    // Créer la capacité par défaut "Basic Attack"
    await prisma.ability.create({
      data: {
        id: '00000000-0000-0000-0000-000000000000', // ID fixe pour faciliter les références
        name: 'Basic Attack',
        description: 'A basic attack using claws or teeth',
        type: AbilityType.ATTACK,
        power: 10,
        accuracy: 95,
        cooldown: 0,
        kittenId: defaultKitten.id,
      },
    });

    console.log('Default ability created successfully');
  } else {
    console.log('Default ability already exists, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
