import { Injectable } from '@nestjs/common';
import { AbilityType } from '@prisma/client';
import {
  BattleState,
  BattleKitten,
  BattleAbility,
  BattleLog,
} from '../models/battle-state.model';

@Injectable()
export class BattleEngineService {
  // Générer un nombre aléatoire entre min et max (inclus)
  private getRandomNumber(min: number, max: number, seed: number): number {
    // Utiliser une fonction de pseudo-aléatoire basée sur le seed
    const x = Math.sin(seed) * 10000;
    const randomValue = x - Math.floor(x);
    
    return Math.floor(randomValue * (max - min + 1)) + min;
  }

  // Simuler un combat complet entre deux chatons
  async simulateBattle(battleState: BattleState): Promise<BattleState> {
    let round = 1;
    let seed = battleState.seed;
    
    // Tant que le combat n'est pas terminé (un des chatons a 0 PV ou on atteint 30 rounds)
    while (
      !this.isBattleFinished(battleState.challenger, battleState.opponent) &&
      round <= 30
    ) {
      // Déterminer l'ordre des tours basé sur l'agilité
      const firstKitten = this.getFirstKitten(
        battleState.challenger,
        battleState.opponent,
        seed,
      );
      const secondKitten =
        firstKitten.id === battleState.challenger.id
          ? battleState.opponent
          : battleState.challenger;

      // Premier chaton attaque
      seed = this.processAttack(
        battleState,
        firstKitten,
        secondKitten,
        round,
        1,
        seed,
      );

      // Vérifier si le combat est terminé après la première attaque
      if (this.isBattleFinished(battleState.challenger, battleState.opponent)) {
        break;
      }

      // Deuxième chaton attaque
      seed = this.processAttack(
        battleState,
        secondKitten,
        firstKitten,
        round,
        2,
        seed,
      );

      // Mettre à jour les cooldowns à la fin du round
      this.updateCooldowns(battleState.challenger.abilities);
      this.updateCooldowns(battleState.opponent.abilities);

      // Passer au round suivant
      round++;
    }

    // Déterminer le vainqueur
    if (battleState.challenger.currentHealth <= 0) {
      battleState.winnerId = battleState.opponent.id;
    } else if (battleState.opponent.currentHealth <= 0) {
      battleState.winnerId = battleState.challenger.id;
    }
    // Si on arrive à 30 rounds sans vainqueur, c'est un match nul (pas de winnerId)

    // Marquer le combat comme terminé
    battleState.isFinished = true;
    battleState.round = round;

    // Calculer l'expérience gagnée par le vainqueur (si il y en a un)
    if (battleState.winnerId) {
      const winner =
        battleState.challenger.id === battleState.winnerId
          ? battleState.challenger
          : battleState.opponent;
      const loser =
        battleState.challenger.id !== battleState.winnerId
          ? battleState.challenger
          : battleState.opponent;
      
      battleState.experienceGain = this.calculateExperienceGain(winner, loser);
    }

    return battleState;
  }

  // Vérifier si le combat est terminé
  private isBattleFinished(challenger: BattleKitten, opponent: BattleKitten): boolean {
    return challenger.currentHealth <= 0 || opponent.currentHealth <= 0;
  }

  // Déterminer quel chaton attaque en premier (basé sur l'agilité)
  private getFirstKitten(
    challenger: BattleKitten,
    opponent: BattleKitten,
    seed: number,
  ): BattleKitten {
    const challengerRoll = this.getRandomNumber(1, 20, seed) + challenger.agility;
    seed += 1;
    const opponentRoll = this.getRandomNumber(1, 20, seed) + opponent.agility;
    
    return challengerRoll >= opponentRoll ? challenger : opponent;
  }

  // Traiter une attaque
  private processAttack(
    battleState: BattleState,
    attacker: BattleKitten,
    defender: BattleKitten,
    round: number,
    turn: number,
    seed: number,
  ): number {
    // Sélectionner une capacité disponible
    const ability = this.selectAbility(attacker, seed);
    seed += 1;

    // Si aucune capacité n'est disponible, passer le tour
    if (!ability) {
      battleState.logs.push({
        round,
        turn,
        attackerId: attacker.id,
        defenderId: defender.id,
        abilityId: '',
        abilityName: 'Pass',
        damage: 0,
        isSuccess: true,
        isCritical: false,
        message: `${attacker.name} passes their turn.`,
        attackerHealth: attacker.currentHealth,
        defenderHealth: defender.currentHealth,
      });
      return seed;
    }

    // Vérifier si l'attaque touche
    const isSuccess = this.checkHit(ability, attacker, defender, seed);
    seed += 1;

    // Si l'attaque échoue
    if (!isSuccess) {
      battleState.logs.push({
        round,
        turn,
        attackerId: attacker.id,
        defenderId: defender.id,
        abilityId: ability.id,
        abilityName: ability.name,
        damage: 0,
        isSuccess: false,
        isCritical: false,
        message: `${attacker.name} misses with ${ability.name}!`,
        attackerHealth: attacker.currentHealth,
        defenderHealth: defender.currentHealth,
      });
      
      // Mettre la capacité en cooldown même si elle échoue
      ability.currentCooldown = ability.cooldown;
      
      return seed;
    }

    // Vérifier si c'est un coup critique
    const isCritical = this.checkCritical(attacker, seed);
    seed += 1;

    // Calculer les dégâts
    let damage = this.calculateDamage(ability, attacker, defender, isCritical, seed);
    seed += 1;

    // Gérer les différents types de capacités
    switch (ability.type) {
      case AbilityType.ATTACK.toString():
        // Déjà géré par calculateDamage
        break;
      case AbilityType.DEFENSE.toString():
        // Les capacités défensives réduisent les dégâts reçus au prochain tour
        damage = 0;
        // TODO: implémenter un effet de défense
        break;
      case AbilityType.SPECIAL.toString():
        // Les capacités spéciales peuvent avoir des effets uniques
        // TODO: implémenter des effets spéciaux
        break;
      case AbilityType.HEAL.toString():
        // Les capacités de soin restaurent les PV
        damage = -damage; // Convertir en soin
        attacker.currentHealth = Math.min(
          attacker.currentHealth - damage, // Soustraire un nombre négatif = ajouter
          attacker.maxHealth,
        );
        battleState.logs.push({
          round,
          turn,
          attackerId: attacker.id,
          defenderId: attacker.id, // Le défenseur est l'attaquant lui-même pour un soin
          abilityId: ability.id,
          abilityName: ability.name,
          damage: -damage, // Valeur positive pour l'affichage
          isSuccess: true,
          isCritical,
          message: isCritical
            ? `${attacker.name} uses ${ability.name} and heals for ${-damage} (Critical)!`
            : `${attacker.name} uses ${ability.name} and heals for ${-damage}!`,
          attackerHealth: attacker.currentHealth,
          defenderHealth: defender.currentHealth,
        });
        
        ability.currentCooldown = ability.cooldown;
        return seed;
      case AbilityType.BUFF.toString():
        // Les capacités de buff améliorent temporairement les stats
        damage = 0;
        // TODO: implémenter un effet de buff
        break;
      case AbilityType.DEBUFF.toString():
        // Les capacités de debuff réduisent temporairement les stats de l'adversaire
        damage = 0;
        // TODO: implémenter un effet de debuff
        break;
    }

    // Appliquer les dégâts au défenseur (sauf pour les capacités spéciales déjà gérées)
    if (ability.type === AbilityType.ATTACK.toString()) {
      defender.currentHealth = Math.max(0, defender.currentHealth - damage);
      
      battleState.logs.push({
        round,
        turn,
        attackerId: attacker.id,
        defenderId: defender.id,
        abilityId: ability.id,
        abilityName: ability.name,
        damage,
        isSuccess: true,
        isCritical,
        message: isCritical
          ? `${attacker.name} uses ${ability.name} and deals ${damage} damage (Critical)!`
          : `${attacker.name} uses ${ability.name} and deals ${damage} damage!`,
        attackerHealth: attacker.currentHealth,
        defenderHealth: defender.currentHealth,
      });
    }

    // Mettre la capacité en cooldown
    ability.currentCooldown = ability.cooldown;
    
    return seed;
  }

  // Sélectionner une capacité à utiliser
  private selectAbility(kitten: BattleKitten, seed: number): BattleAbility | null {
    // Filtrer les capacités disponibles (pas en cooldown)
    const availableAbilities = kitten.abilities.filter(
      (ability) => ability.currentCooldown === 0,
    );

    if (availableAbilities.length === 0) {
      return null;
    }

    // Sélectionner une capacité aléatoire parmi celles disponibles
    const randomIndex = this.getRandomNumber(0, availableAbilities.length - 1, seed);
    return availableAbilities[randomIndex];
  }

  // Vérifier si l'attaque touche
  private checkHit(
    ability: BattleAbility,
    attacker: BattleKitten,
    defender: BattleKitten,
    seed: number,
  ): boolean {
    // Calcul basé sur la précision de la capacité et l'agilité du défenseur
    const baseChance = ability.accuracy;
    const defenderDodgeChance = defender.agility * 2;
    
    const finalChance = Math.max(baseChance - defenderDodgeChance, 10); // Minimum 10% de chance
    
    const roll = this.getRandomNumber(1, 100, seed);
    return roll <= finalChance;
  }

  // Vérifier si c'est un coup critique
  private checkCritical(attacker: BattleKitten, seed: number): boolean {
    // Chances de critique basées sur l'intelligence
    const critChance = 5 + Math.floor(attacker.intelligence / 2); // Entre 5% et 15%
    
    const roll = this.getRandomNumber(1, 100, seed);
    return roll <= critChance;
  }

  // Calculer les dégâts d'une attaque
  private calculateDamage(
    ability: BattleAbility,
    attacker: BattleKitten,
    defender: BattleKitten,
    isCritical: boolean,
    seed: number,
  ): number {
    // Dégâts de base de la capacité
    let damage = ability.power;
    
    // Ajouter l'attribut correspondant au type de capacité
    if (ability.type === AbilityType.ATTACK.toString()) {
      damage += attacker.strength * 2;
    } else if (ability.type === AbilityType.SPECIAL.toString()) {
      damage += attacker.intelligence * 2;
    } else if (ability.type === AbilityType.HEAL.toString()) {
      damage += attacker.intelligence * 3;
    }
    
    // Ajouter de la variance
    const variance = this.getRandomNumber(80, 120, seed) / 100; // 0.8 à 1.2
    damage = Math.floor(damage * variance);
    
    // Appliquer le multiplicateur de coup critique
    if (isCritical) {
      damage = Math.floor(damage * 1.5);
    }
    
    // Appliquer la réduction de dégâts basée sur la constitution du défenseur
    const damageReduction = 1 - (defender.constitution * 0.03); // 3% par point de constitution
    damage = Math.floor(damage * damageReduction);
    
    return Math.max(1, damage); // Minimum 1 dégât
  }

  // Mettre à jour les cooldowns à la fin d'un round
  private updateCooldowns(abilities: BattleAbility[]): void {
    for (const ability of abilities) {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown--;
      }
    }
  }

  // Calculer l'expérience gagnée par le vainqueur
  private calculateExperienceGain(winner: BattleKitten, loser: BattleKitten): number {
    // Formule de base: 10 + (niveau de l'adversaire * 5)
    const baseXP = 10 + (loser.level * 5);
    
    // Ajuster en fonction de la différence de niveau
    const levelDifference = loser.level - winner.level;
    const levelMultiplier = 1 + (levelDifference * 0.1); // 10% par niveau de différence
    
    return Math.max(5, Math.floor(baseXP * levelMultiplier));
  }
}
