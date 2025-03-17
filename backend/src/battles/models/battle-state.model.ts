import { Ability, Kitten } from '@prisma/client';

// Interface pour représenter l'état d'un chaton pendant le combat
export interface BattleKitten {
  id: string;
  name: string;
  level: number;
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
  currentHealth: number;
  maxHealth: number;
  abilities: BattleAbility[];
}

// Interface pour représenter une capacité pendant le combat
export interface BattleAbility {
  id: string;
  name: string;
  description: string;
  type: string;
  power: number;
  accuracy: number;
  cooldown: number;
  currentCooldown: number;
}

// Interface pour représenter l'état du combat
export interface BattleState {
  id: string;
  round: number;
  seed: number;
  challenger: BattleKitten;
  opponent: BattleKitten;
  logs: BattleLog[];
  isFinished: boolean;
  winnerId?: string;
  experienceGain: number;
}

// Interface pour représenter un log de combat
export interface BattleLog {
  round: number;
  turn: number;
  attackerId: string;
  defenderId: string;
  abilityId: string;
  abilityName: string;
  damage: number;
  isSuccess: boolean;
  isCritical: boolean;
  message: string;
  attackerHealth: number;
  defenderHealth: number;
}

// Fonction utilitaire pour convertir un chaton de la base de données en chaton de combat
export function convertKittenToBattleKitten(
  kitten: Kitten & { abilities: Ability[] },
): BattleKitten {
  const maxHealth = calculateMaxHealth(kitten);
  
  return {
    id: kitten.id,
    name: kitten.name,
    level: kitten.level,
    strength: kitten.strength,
    agility: kitten.agility,
    constitution: kitten.constitution,
    intelligence: kitten.intelligence,
    currentHealth: maxHealth,
    maxHealth,
    abilities: kitten.abilities.map(ability => ({
      id: ability.id,
      name: ability.name,
      description: ability.description,
      type: ability.type.toString(),
      power: ability.power,
      accuracy: ability.accuracy,
      cooldown: ability.cooldown,
      currentCooldown: 0,
    })),
  };
}

// Fonction utilitaire pour calculer la santé maximale d'un chaton
export function calculateMaxHealth(kitten: Kitten): number {
  // Formule simple: 50 + (constitution * 10) + (level * 5)
  return 50 + (kitten.constitution * 10) + (kitten.level * 5);
}
