'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { 
  fetchKittenById, 
  assignSkillPoints, 
  clearCurrentKitten, 
  clearError 
} from '@/store/slices/kittenSlice';

export default function KittenDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentKitten, loading, error } = useSelector((state: RootState) => state.kittens);
  
  // États pour gérer l'attribution des points de compétence
  const [strengthPoints, setStrengthPoints] = useState(0);
  const [agilityPoints, setAgilityPoints] = useState(0);
  const [constitutionPoints, setConstitutionPoints] = useState(0);
  const [intelligencePoints, setIntelligencePoints] = useState(0);
  const [isAssigningPoints, setIsAssigningPoints] = useState(false);
  
  // Calculer le total des points attribués
  const totalAssignedPoints = strengthPoints + agilityPoints + constitutionPoints + intelligencePoints;
  
  // Récupérer les points de compétence disponibles
  const availablePoints = currentKitten?.skillPoints || 0;
  
  useEffect(() => {
    dispatch(fetchKittenById(id));
    
    // Nettoyer lors du démontage
    return () => {
      dispatch(clearCurrentKitten());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  const handleAssignPoints = async () => {
    if (!currentKitten) return;
    
    // Vérifier que le total ne dépasse pas les points disponibles
    if (totalAssignedPoints > availablePoints) {
      alert('Vous avez attribué plus de points que disponible!');
      return;
    }
    
    // Ne rien faire si aucun point n'est attribué
    if (totalAssignedPoints === 0) {
      return;
    }
    
    const data = {
      strength: strengthPoints,
      agility: agilityPoints,
      constitution: constitutionPoints,
      intelligence: intelligencePoints,
    };
    
    await dispatch(assignSkillPoints({ id: currentKitten.id, data }));
    
    // Réinitialiser les champs
    setStrengthPoints(0);
    setAgilityPoints(0);
    setConstitutionPoints(0);
    setIntelligencePoints(0);
    setIsAssigningPoints(false);
  };
  
  const cancelAssignPoints = () => {
    setStrengthPoints(0);
    setAgilityPoints(0);
    setConstitutionPoints(0);
    setIntelligencePoints(0);
    setIsAssigningPoints(false);
  };
  
  // Calculer la santé maximale du chaton (pour l'affichage)
  const calculateMaxHealth = (kitten: any) => {
    return 50 + (kitten.constitution * 10) + (kitten.level * 5);
  };
  
  // Calculer l'expérience nécessaire pour le prochain niveau
  const experienceForNextLevel = (level: number) => {
    return 100 * level;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border text-indigo-500" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p className="mt-2 text-gray-600">Chargement du chaton...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
        <button
          onClick={() => router.push('/kittens')}
          className="mt-4 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-2 px-4 rounded"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  if (!currentKitten) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
        <span className="block sm:inline">Chaton non trouvé</span>
        <button
          onClick={() => router.push('/kittens')}
          className="mt-4 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold py-2 px-4 rounded"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{currentKitten.name}</h1>
            <div className="flex space-x-2">
              <Link
                href="/kittens"
                className="px-4 py-2 text-sm text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
              >
                Retour à la liste
              </Link>
              <Link
                href={`/battles/new?kittenId=${currentKitten.id}`}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Lancer un combat
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row">
              {/* Section gauche - Avatar et informations de base */}
              <div className="md:w-1/3 pr-8">
                <div className="text-center">
                  <img
                    className="h-48 w-48 rounded-full mx-auto object-cover"
                    src={currentKitten.avatarUrl || 'https://placekitten.com/200/200'} 
                    alt={currentKitten.name}
                  />
                  <h2 className="mt-4 text-2xl font-bold">{currentKitten.name}</h2>
                  <p className="text-gray-600">Niveau {currentKitten.level}</p>
                </div>
                
                <div className="mt-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Expérience</label>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-4 mb-1 text-xs flex rounded bg-indigo-200">
                        <div 
                          style={{ 
                            width: `${(currentKitten.experience / experienceForNextLevel(currentKitten.level)) * 100}%` 
                          }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {currentKitten.experience} / {experienceForNextLevel(currentKitten.level)} XP
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Points de vie</label>
                    <div className="text-lg font-semibold text-gray-900">
                      {calculateMaxHealth(currentKitten)} PV
                    </div>
                  </div>
                  
                  {currentKitten.stats && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-medium text-gray-900">Statistiques de combat</h3>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Victoires</p>
                          <p className="mt-1 text-sm text-gray-900">{currentKitten.stats.wins}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Défaites</p>
                          <p className="mt-1 text-sm text-gray-900">{currentKitten.stats.losses}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nuls</p>
                          <p className="mt-1 text-sm text-gray-900">{currentKitten.stats.draws}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Section droite - Attributs et compétences */}
              <div className="md:w-2/3 mt-8 md:mt-0">
                <h3 className="text-lg font-medium text-gray-900">Attributs</h3>
                
                {currentKitten.skillPoints > 0 && !isAssigningPoints && (
                  <div className="mt-2 mb-4">
                    <button
                      onClick={() => setIsAssigningPoints(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Assigner {currentKitten.skillPoints} points
                    </button>
                  </div>
                )}
                
                {isAssigningPoints ? (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-sm">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Attribution de points ({availablePoints - totalAssignedPoints} restants)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Force: {currentKitten.strength} (+{strengthPoints})
                        </label>
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => setStrengthPoints(Math.max(0, strengthPoints - 1))}
                            disabled={strengthPoints === 0}
                            className="border border-gray-300 rounded-l-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-white border-t border-b border-gray-300">
                            {strengthPoints}
                          </span>
                          <button
                            onClick={() => setStrengthPoints(Math.min(availablePoints - (totalAssignedPoints - strengthPoints), strengthPoints + 1))}
                            disabled={totalAssignedPoints >= availablePoints}
                            className="border border-gray-300 rounded-r-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Agilité: {currentKitten.agility} (+{agilityPoints})
                        </label>
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => setAgilityPoints(Math.max(0, agilityPoints - 1))}
                            disabled={agilityPoints === 0}
                            className="border border-gray-300 rounded-l-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-white border-t border-b border-gray-300">
                            {agilityPoints}
                          </span>
                          <button
                            onClick={() => setAgilityPoints(Math.min(availablePoints - (totalAssignedPoints - agilityPoints), agilityPoints + 1))}
                            disabled={totalAssignedPoints >= availablePoints}
                            className="border border-gray-300 rounded-r-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Constitution: {currentKitten.constitution} (+{constitutionPoints})
                        </label>
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => setConstitutionPoints(Math.max(0, constitutionPoints - 1))}
                            disabled={constitutionPoints === 0}
                            className="border border-gray-300 rounded-l-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-white border-t border-b border-gray-300">
                            {constitutionPoints}
                          </span>
                          <button
                            onClick={() => setConstitutionPoints(Math.min(availablePoints - (totalAssignedPoints - constitutionPoints), constitutionPoints + 1))}
                            disabled={totalAssignedPoints >= availablePoints}
                            className="border border-gray-300 rounded-r-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Intelligence: {currentKitten.intelligence} (+{intelligencePoints})
                        </label>
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => setIntelligencePoints(Math.max(0, intelligencePoints - 1))}
                            disabled={intelligencePoints === 0}
                            className="border border-gray-300 rounded-l-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-white border-t border-b border-gray-300">
                            {intelligencePoints}
                          </span>
                          <button
                            onClick={() => setIntelligencePoints(Math.min(availablePoints - (totalAssignedPoints - intelligencePoints), intelligencePoints + 1))}
                            disabled={totalAssignedPoints >= availablePoints}
                            className="border border-gray-300 rounded-r-md px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={cancelAssignPoints}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleAssignPoints}
                        disabled={totalAssignedPoints === 0}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        Assigner les points
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Force</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{currentKitten.strength}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Agilité</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{currentKitten.agility}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Constitution</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{currentKitten.constitution}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Intelligence</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{currentKitten.intelligence}</p>
                    </div>
                  </div>
                )}
                
                {/* Section des capacités */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Capacités</h3>
                  
                  {currentKitten.abilities.length === 0 ? (
                    <p className="text-gray-600 mt-2">Ce chaton n&apos;a pas encore de capacités.</p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {currentKitten.abilities.map((ability) => (
                        <div key={ability.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-md font-medium text-gray-900">{ability.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{ability.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              ability.type === 'ATTACK' ? 'bg-red-100 text-red-800' :
                              ability.type === 'DEFENSE' ? 'bg-blue-100 text-blue-800' :
                              ability.type === 'SPECIAL' ? 'bg-purple-100 text-purple-800' :
                              ability.type === 'HEAL' ? 'bg-green-100 text-green-800' :
                              ability.type === 'BUFF' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ability.type}
                            </span>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Puissance:</span> {ability.power}
                            </div>
                            <div>
                              <span className="text-gray-500">Précision:</span> {ability.accuracy}%
                            </div>
                            <div>
                              <span className="text-gray-500">Délai:</span> {ability.cooldown} tour{ability.cooldown !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
