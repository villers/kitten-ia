'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchBattleById, 
  clearCurrentBattle, 
  clearError,
  setCurrentRound,
  incrementRound,
  decrementRound
} from '../../../store/slices/battleSlice';

export default function BattleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentBattle, currentRound, loading, error } = useSelector((state: RootState) => state.battles);
  
  // État pour gérer l'auto-play de la simulation
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  // États pour stocker les points de vie actuels
  const [challengerHealth, setChallengerHealth] = useState({ current: 0, max: 0 });
  const [opponentHealth, setOpponentHealth] = useState({ current: 0, max: 0 });
  
  // Fonction pour calculer la santé d'un chaton à un round donné
  const calculateHealth = (kittenId: string, round: number) => {
    if (!currentBattle) return { current: 0, max: 0 };
    
    // Obtenir les mouvements jusqu'au round actuel
    const movesUntilRound = currentBattle.battleMoves.filter(move => move.round <= round);
    
    // Déterminer si c'est le challenger ou l'adversaire
    const isChallenger = kittenId === currentBattle.challenger.id;
    const kitten = isChallenger ? currentBattle.challenger : currentBattle.opponent;
    
    // Calculer la santé maximale
    const maxHealth = 50 + (kitten.constitution * 10) + (kitten.level * 5);
    
    // Si le round est 0, la santé est au maximum
    if (round === 0) return { current: maxHealth, max: maxHealth };
    
    // Calculer les dégâts subis
    let currentHealth = maxHealth;
    
    movesUntilRound.forEach(move => {
      // Si le kitten est la cible de l'attaque et que l'attaquant a une capacité valide
      if (move.kittenId !== kittenId && move.ability) {
        // Réduire la santé (seulement pour les attaques, pas les soins)
        if (move.damage > 0 && move.isSuccess) {
          currentHealth -= move.damage;
        }
      } 
      // Si le kitten utilise une capacité de soin sur lui-même
      else if (move.kittenId === kittenId && move.ability && move.ability.type === 'HEAL' && move.isSuccess) {
        currentHealth = Math.min(currentHealth + move.damage, maxHealth);
      }
    });
    
    return { current: Math.max(0, currentHealth), max: maxHealth };
  };
  
  // Effet pour récupérer les détails du combat
  useEffect(() => {
    dispatch(fetchBattleById(id));
    
    // Nettoyer lors du démontage
    return () => {
      dispatch(clearCurrentBattle());
      dispatch(clearError());
    };
  }, [dispatch, id]);
  
  // Effet pour mettre à jour les points de vie actuels quand le round change
  useEffect(() => {
    if (currentBattle) {
      setChallengerHealth(calculateHealth(currentBattle.challenger.id, currentRound));
      setOpponentHealth(calculateHealth(currentBattle.opponent.id, currentRound));
    }
  }, [currentBattle, currentRound]);
  
  // Effet pour gérer l'auto-play
  useEffect(() => {
    if (!isAutoPlaying || !currentBattle) return;
    
    // Si on est déjà au dernier round, arrêter l'auto-play
    if (currentRound >= currentBattle.totalRounds) {
      setIsAutoPlaying(false);
      return;
    }
    
    // Délai entre chaque round
    const timer = setTimeout(() => {
      dispatch(incrementRound());
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentRound, currentBattle, dispatch]);
  
  // Fonction pour démarrer l'auto-play
  const startAutoPlay = () => {
    if (!currentBattle) return;
    
    // Si on est au dernier round, revenir au début
    if (currentRound >= currentBattle.totalRounds) {
      dispatch(setCurrentRound(0));
    }
    
    setIsAutoPlaying(true);
  };
  
  // Fonction pour arrêter l'auto-play
  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
  };
  
  // Fonction pour passer au début
  const goToStart = () => {
    dispatch(setCurrentRound(0));
    setIsAutoPlaying(false);
  };
  
  // Fonction pour passer à la fin
  const goToEnd = () => {
    if (!currentBattle) return;
    
    dispatch(setCurrentRound(currentBattle.totalRounds));
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border text-indigo-500" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p className="mt-2 text-gray-600">Chargement du combat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
        <button
          onClick={() => router.push('/battles')}
          className="mt-4 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-2 px-4 rounded"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  if (!currentBattle) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
        <span className="block sm:inline">Combat non trouvé</span>
        <button
          onClick={() => router.push('/battles')}
          className="mt-4 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold py-2 px-4 rounded"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  // Obtenir les mouvements du round actuel
  const currentMoves = currentRound > 0 
    ? currentBattle.battleMoves.filter(move => move.round === currentRound)
    : [];

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Combat: {currentBattle.challenger.name} vs {currentBattle.opponent.name}
            </h1>
            <Link
              href="/battles"
              className="px-4 py-2 text-sm text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          {/* En-tête du combat avec le statut et le vainqueur */}
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {new Date(currentBattle.createdAt).toLocaleDateString()}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {currentBattle.totalRounds} rounds
                </p>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 px-2 py-1 text-xs font-medium rounded-full ${
                  currentBattle.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentBattle.status === 'COMPLETED' ? 'Terminé' : 'En cours'}
                </span>
                {currentBattle.winnerId && (
                  <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    Vainqueur: {
                      currentBattle.winnerId === currentBattle.challenger.id
                        ? currentBattle.challenger.name
                        : currentBattle.opponent.name
                    }
                  </span>
                )}
                {!currentBattle.winnerId && currentBattle.status === 'COMPLETED' && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    Match nul
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Affichage des combattants et de leur santé */}
          <div className="bg-gray-50 px-4 py-6 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Challenger */}
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <img
                    src={currentBattle.challenger.avatarUrl || 'https://placekitten.com/200/200'}
                    alt={currentBattle.challenger.name}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{currentBattle.challenger.name}</h3>
                    <p className="text-sm text-gray-500">Niveau {currentBattle.challenger.level}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
                    <span>PV: {Math.max(0, challengerHealth.current)} / {challengerHealth.max}</span>
                    <span>{Math.floor((challengerHealth.current / challengerHealth.max) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${Math.max(0, (challengerHealth.current / challengerHealth.max) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Force:</span> {currentBattle.challenger.strength}
                  </div>
                  <div>
                    <span className="text-gray-500">Agilité:</span> {currentBattle.challenger.agility}
                  </div>
                  <div>
                    <span className="text-gray-500">Constitution:</span> {currentBattle.challenger.constitution}
                  </div>
                  <div>
                    <span className="text-gray-500">Intelligence:</span> {currentBattle.challenger.intelligence}
                  </div>
                </div>
              </div>
              
              {/* Opponent */}
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <img
                    src={currentBattle.opponent.avatarUrl || 'https://placekitten.com/201/201'}
                    alt={currentBattle.opponent.name}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{currentBattle.opponent.name}</h3>
                    <p className="text-sm text-gray-500">Niveau {currentBattle.opponent.level}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
                    <span>PV: {Math.max(0, opponentHealth.current)} / {opponentHealth.max}</span>
                    <span>{Math.floor((opponentHealth.current / opponentHealth.max) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${Math.max(0, (opponentHealth.current / opponentHealth.max) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Force:</span> {currentBattle.opponent.strength}
                  </div>
                  <div>
                    <span className="text-gray-500">Agilité:</span> {currentBattle.opponent.agility}
                  </div>
                  <div>
                    <span className="text-gray-500">Constitution:</span> {currentBattle.opponent.constitution}
                  </div>
                  <div>
                    <span className="text-gray-500">Intelligence:</span> {currentBattle.opponent.intelligence}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contrôles de simulation */}
          <div className="px-4 py-4 border-t border-b border-gray-200 flex justify-between items-center bg-gray-50 sm:px-6">
            <div className="text-sm text-gray-700">
              Round: <span className="font-medium">{currentRound}</span> / {currentBattle.totalRounds}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={goToStart}
                disabled={currentRound === 0 || isAutoPlaying}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                title="Premier round"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => dispatch(decrementRound())}
                disabled={currentRound === 0 || isAutoPlaying}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                title="Round précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isAutoPlaying ? (
                <button
                  onClick={stopAutoPlay}
                  className="p-2 rounded-md text-red-600 hover:bg-red-100"
                  title="Pause"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 002 0V9a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v2a1 1 0 002 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={startAutoPlay}
                  disabled={currentRound >= (currentBattle?.totalRounds || 0)}
                  className="p-2 rounded-md text-green-600 hover:bg-green-100 disabled:opacity-50"
                  title="Lecture"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={() => dispatch(incrementRound())}
                disabled={currentRound >= (currentBattle?.totalRounds || 0) || isAutoPlaying}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                title="Round suivant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={goToEnd}
                disabled={currentRound >= (currentBattle?.totalRounds || 0) || isAutoPlaying}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                title="Dernier round"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Log des actions */}
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions du round {currentRound}</h3>
            
            {currentRound === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Le combat n&apos;a pas encore commencé. Appuyez sur le bouton &apos;Lecture&apos; ou &apos;Round suivant&apos; pour commencer.
              </div>
            ) : currentMoves.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune action pour ce round.
              </div>
            ) : (
              <div className="space-y-4">
                {currentMoves.filter(move => move.ability).map((move, index) => {
                  const isChallenger = move.kittenId === currentBattle.challenger.id;
                  const attacker = isChallenger ? currentBattle.challenger : currentBattle.opponent;
                  const defender = isChallenger ? currentBattle.opponent : currentBattle.challenger;
                  
                  return (
                    <div key={move.id} className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="flex items-start">
                        <img
                          src={attacker.avatarUrl || `https://placekitten.com/${200 + index}/200`}
                          alt={attacker.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="text-gray-900">
                            <span className="font-medium">{attacker.name}</span> utilise{' '}
                            <span className={`font-medium ${
                              move.ability.type === 'ATTACK' ? 'text-red-600' :
                              move.ability.type === 'DEFENSE' ? 'text-blue-600' :
                              move.ability.type === 'SPECIAL' ? 'text-purple-600' :
                              move.ability.type === 'HEAL' ? 'text-green-600' :
                              move.ability.type === 'BUFF' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {move.ability.name}
                            </span>
                            {move.isSuccess ? (
                              move.ability.type === 'HEAL' ? (
                                <span> et récupère <span className="text-green-600 font-medium">{move.damage}</span> PV{move.isCritical ? ' (Critique!)' : ''}.</span>
                              ) : (
                                <span> et inflige <span className="text-red-600 font-medium">{move.damage}</span> dégâts à {defender.name}{move.isCritical ? ' (Critique!)' : ''}.</span>
                              )
                            ) : (
                              <span> mais échoue.</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Résultat du combat (affiché uniquement si le combat est terminé et qu'on est au dernier round) */}
          {currentBattle.status === 'COMPLETED' && currentRound === currentBattle.totalRounds && (
            <div className="bg-gray-50 px-4 py-5 sm:p-6 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Résultat du combat</h3>
                
                {currentBattle.winnerId ? (
                  <div>
                    <p className="text-lg font-medium mb-1">
                      {currentBattle.winnerId === currentBattle.challenger.id
                        ? `${currentBattle.challenger.name} remporte la victoire!`
                        : `${currentBattle.opponent.name} remporte la victoire!`}
                    </p>
                    <p className="text-sm text-gray-600">
                      Le vainqueur gagne {currentBattle.experienceGain} points d&apos;expérience.
                    </p>
                  </div>
                ) : (
                  <p className="text-lg">Match nul après {currentBattle.totalRounds} rounds!</p>
                )}
                
                <div className="mt-6">
                  <Link
                    href="/battles/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Lancer un nouveau combat
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
