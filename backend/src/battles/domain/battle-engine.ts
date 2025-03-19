import { Battle } from './battle';
import { BattleAbility, BattleKitten } from './battle-kitten';
import { BattleLogEntry } from './battle-log-entry';

export class BattleEngine {
  // Générer un nombre aléatoire entre min et max (inclus)
  private getRandomNumber(min: number, max: number, seed: number): number {
    // Utiliser une fonction de pseudo-aléatoire basée sur le seed
    const x = Math.sin(seed) * 10000;
    const randomValue = x - Math.floor(x);
    
    return Math.floor(randomValue * (max - min + 1)) + min;
  }

  // Simuler un combat complet entre deux chatons
  public simulateBattle(battle: Battle): Battle {
    let currentBattle = battle;
    let round = 1;
    let seed = battle.seed;
    
    // Tant que le combat n'est pas terminé (un des chatons a 0 PV ou on atteint 30 rounds)
    while (!currentBattle.isBattleFinished() && round <= 30) {
      currentBattle = currentBattle.withRound(round);
      
      // Déterminer l'ordre des tours basé sur l'agilité
      const firstKitten = this.getFirstKitten(
        currentBattle.challenger,
        currentBattle.opponent,
        seed,
      );
      
      const secondKitten = firstKitten.id === currentBattle.challenger.id
        ? currentBattle.opponent
        : currentBattle.challenger;

      // Premier chaton attaque
      const result = this.processAttack(
        currentBattle,
        firstKitten,
        secondKitten,
        round,
        1,
        seed,
      );
      
      currentBattle = result.battle;
      seed = result.seed;

      // Vérifier si le combat est terminé après la première attaque
      if (currentBattle.isBattleFinished()) {
        break;
      }

      // Deuxième chaton attaque
      const secondResult = this.processAttack(
        currentBattle,
        secondKitten,
        firstKitten,
        round,
        2,
        seed,
      );
      
      currentBattle = secondResult.battle;
      seed = secondResult.seed;

      // Mettre à jour les cooldowns à la fin du round
      currentBattle = currentBattle.withChallenger(
        currentBattle.challenger.updateAllAbilitiesCooldowns()
      );
      
      currentBattle = currentBattle.withOpponent(
        currentBattle.opponent.updateAllAbilitiesCooldowns()
      );

      // Passer au round suivant
      round++;
    }

    // Déterminer le vainqueur
    const winnerId = currentBattle.determineWinner();
    
    // Calculer l'expérience gagnée par le vainqueur (si il y en a un)
    let experienceGain = 0;
    
    if (winnerId) {
      const winner = winnerId === currentBattle.challenger.id
        ? currentBattle.challenger
        : currentBattle.opponent;
        
      const loser = winnerId === currentBattle.challenger.id
        ? currentBattle.opponent
        : currentBattle.challenger;
      
      experienceGain = this.calculateExperienceGain(winner, loser);
    }

    // Marquer le combat comme terminé
    return currentBattle
      .finish(winnerId)
      .withExperienceGain(experienceGain);
  }

  // Déterminer quel chaton attaque en premier (basé sur l'agilité)
  private getFirstKitten(
    challenger: BattleKitten,
    opponent: BattleKitten,
    seed: number,
  ): BattleKitten {
    const challengerRoll = this.getRandomNumber(1, 20, seed) + challenger.agility;
    const opponentRoll = this.getRandomNumber(1, 20, seed + 1) + opponent.agility;
    
    return challengerRoll >= opponentRoll ? challenger : opponent;
  }

  // Traiter une attaque
  private processAttack(
    battle: Battle,
    attacker: BattleKitten,
    defender: BattleKitten,
    round: number,
    turn: number,
    seed: number,
  ): { battle: Battle; seed: number } {
    // Sélectionner une capacité disponible
    const ability = this.selectAbility(attacker, seed);
    seed += 1;

    // Si aucune capacité n'est disponible, passer le tour
    if (!ability) {
      const log = BattleLogEntry.create(
        round,
        turn,
        attacker.id,
        defender.id,
        '',
        'Pass',
        0,
        true,
        false,
        `${attacker.name} passes their turn.`,
        attacker.currentHealth,
        defender.currentHealth,
      );
      
      return { 
        battle: battle.addLog(log),
        seed
      };
    }

    // Vérifier si l'attaque touche
    const isSuccess = this.checkHit(ability, attacker, defender, seed);
    seed += 1;

    // Si l'attaque échoue
    if (!isSuccess) {
      const log = BattleLogEntry.create(
        round,
        turn,
        attacker.id,
        defender.id,
        ability.id,
        ability.name,
        0,
        false,
        false,
        `${attacker.name} misses with ${ability.name}!`,
        attacker.currentHealth,
        defender.currentHealth,
      );
      
      // Mettre la capacité en cooldown même si elle échoue
      const updatedAttacker = attacker.updateAbility(ability.resetCooldown());
      
      return { 
        battle: battle
          .addLog(log)
          .withChallenger(updatedAttacker.id === battle.challenger.id ? updatedAttacker : battle.challenger)
          .withOpponent(updatedAttacker.id === battle.opponent.id ? updatedAttacker : battle.opponent),
        seed
      };
    }

    // Vérifier si c'est un coup critique
    const isCritical = this.checkCritical(attacker, seed);
    seed += 1;

    // Calculer les dégâts
    let damage = this.calculateDamage(ability, attacker, defender, isCritical, seed);
    seed += 1;

    // Par défaut, on considère qu'on va attaquer le défenseur
    let targetId = defender.id;
    let attackerUpdated = attacker;
    let defenderUpdated = defender;
    let message = '';

    // Gérer les différents types de capacités
    switch (ability.type) {
      case 'ATTACK':
        // Appliquer les dégâts au défenseur
        defenderUpdated = defender.takeDamage(damage);
        message = isCritical
          ? `${attacker.name} uses ${ability.name} and deals ${damage} damage (Critical)!`
          : `${attacker.name} uses ${ability.name} and deals ${damage} damage!`;
        break;
        
      case 'HEAL':
        // Les capacités de soin restaurent les PV
        damage = -damage; // Convertir en soin
        attackerUpdated = attacker.heal(Math.abs(damage));
        targetId = attacker.id; // Le défenseur est l'attaquant lui-même pour un soin
        message = isCritical
          ? `${attacker.name} uses ${ability.name} and heals for ${Math.abs(damage)} (Critical)!`
          : `${attacker.name} uses ${ability.name} and heals for ${Math.abs(damage)}!`;
        break;
        
      case 'DEFENSE':
      case 'SPECIAL':
      case 'BUFF':
      case 'DEBUFF':
        // Pour l'instant, ces types de capacités ne font rien de particulier
        damage = 0;
        message = `${attacker.name} uses ${ability.name}!`;
        break;
    }

    // Créer l'entrée de log
    const log = BattleLogEntry.create(
      round,
      turn,
      attacker.id,
      targetId,
      ability.id,
      ability.name,
      Math.abs(damage), // Pour l'affichage, on veut toujours une valeur positive
      true,
      isCritical,
      message,
      attackerUpdated.currentHealth,
      defenderUpdated.currentHealth,
    );

    // Mettre la capacité en cooldown
    attackerUpdated = attackerUpdated.updateAbility(ability.resetCooldown());

    // Mettre à jour la bataille
    const updatedBattle = battle
      .addLog(log)
      .withChallenger(attackerUpdated.id === battle.challenger.id ? attackerUpdated : defenderUpdated)
      .withOpponent(attackerUpdated.id === battle.opponent.id ? attackerUpdated : defenderUpdated);

    return { battle: updatedBattle, seed };
  }

  // Sélectionner une capacité à utiliser
  private selectAbility(kitten: BattleKitten, seed: number): BattleAbility | null {
    const availableAbilities = kitten.getAvailableAbilities();

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
    if (ability.type === 'ATTACK') {
      damage += attacker.strength * 2;
    } else if (ability.type === 'SPECIAL') {
      damage += attacker.intelligence * 2;
    } else if (ability.type === 'HEAL') {
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