// Énumérations pour les tests qui reflètent celles de Prisma
export enum BattleStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum AbilityType {
  ATTACK = 'ATTACK',
  DEFENSE = 'DEFENSE',
  SPECIAL = 'SPECIAL',
  HEAL = 'HEAL',
  BUFF = 'BUFF',
  DEBUFF = 'DEBUFF'
}
