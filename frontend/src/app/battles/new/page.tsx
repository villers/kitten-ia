'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchKittens, Kitten } from '@/store/slices/kittenSlice';
import { createBattle, clearError } from '@/store/slices/battleSlice';
import Link from 'next/link';

export default function NewBattlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  const [challengerId, setChallengerId] = useState<string>('');
  const [opponentId, setOpponentId] = useState<string>('');
  
  const { kittens, loading: kittensLoading } = useSelector((state: RootState) => state.kittens);
  const { loading: battleLoading, error } = useSelector((state: RootState) => state.battles);

  // Vérifier si un ID de chaton est fourni dans l'URL
  useEffect(() => {
    const kittenId = searchParams.get('kittenId');
    if (kittenId) {
      setChallengerId(kittenId);
    }
  }, [searchParams]);
  
  // Récupérer la liste des chatons
  useEffect(() => {
    dispatch(fetchKittens());
    
    // Nettoyer les erreurs lors du démontage
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!challengerId || !opponentId) {
      alert('Veuillez sélectionner un challenger et un adversaire.');
      return;
    }
    
    // Vérifier que le challenger et l'adversaire sont différents
    if (challengerId === opponentId) {
      alert('Le challenger et l\'adversaire doivent être différents.');
      return;
    }
    
    const result = await dispatch(createBattle({
      challengerId,
      data: { opponentId },
    }));
    
    if (createBattle.fulfilled.match(result)) {
      // Redirection vers la page de détail du combat
      router.push(`/battles/${result.payload.id}`);
    }
  };

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Nouveau Combat</h1>
          <Link
            href="/battles"
            className="px-4 py-2 text-sm text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
          >
            Retour
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {kittensLoading ? (
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="spinner-border text-indigo-500" role="status">
                    <span className="sr-only">Chargement...</span>
                  </div>
                  <p className="mt-2 text-gray-600">Chargement des chatons...</p>
                </div>
              </div>
            ) : kittens.length < 2 ? (
              <div className="text-center py-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vous avez besoin d&apos;au moins deux chatons pour lancer un combat</h3>
                <p className="text-gray-600 mb-4">
                  {kittens.length === 0 ? "Vous n'avez pas encore de chatons." : "Vous n'avez qu'un seul chaton."}
                </p>
                <Link
                  href="/kittens/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Créer un chaton
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Sélectionnez les combattants</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choisissez le chaton challenger et son adversaire pour le combat.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="challenger" className="block text-sm font-medium text-gray-700">
                        Challenger
                      </label>
                      <select
                        id="challenger"
                        name="challenger"
                        value={challengerId}
                        onChange={(e) => setChallengerId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Sélectionnez un chaton</option>
                        {kittens.map((kitten: Kitten) => (
                          <option key={kitten.id} value={kitten.id}>
                            {kitten.name} (Niveau {kitten.level})
                          </option>
                        ))}
                      </select>
                      
                      {challengerId && (
                        <div className="mt-4">
                          <KittenPreview kittenId={challengerId} kittens={kittens} />
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="opponent" className="block text-sm font-medium text-gray-700">
                        Adversaire
                      </label>
                      <select
                        id="opponent"
                        name="opponent"
                        value={opponentId}
                        onChange={(e) => setOpponentId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Sélectionnez un chaton</option>
                        {kittens
                          .filter((kitten) => kitten.id !== challengerId)
                          .map((kitten: Kitten) => (
                            <option key={kitten.id} value={kitten.id}>
                              {kitten.name} (Niveau {kitten.level})
                            </option>
                          ))}
                      </select>
                      
                      {opponentId && (
                        <div className="mt-4">
                          <KittenPreview kittenId={opponentId} kittens={kittens} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <Link
                        href="/battles"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Annuler
                      </Link>
                      <button
                        type="submit"
                        disabled={battleLoading || !challengerId || !opponentId || challengerId === opponentId}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {battleLoading ? 'Combat en cours...' : 'Lancer le combat'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KittenPreview({ kittenId, kittens }: { kittenId: string; kittens: Kitten[] }) {
  const kitten = kittens.find((k) => k.id === kittenId);
  
  if (!kitten) return null;
  
  // Calculer la santé maximale
  const maxHealth = 50 + (kitten.constitution * 10) + (kitten.level * 5);
  
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="flex items-center">
        <img
          src={kitten.avatarUrl || 'https://placekitten.com/200/200'}
          alt={kitten.name}
          className="h-10 w-10 rounded-full object-cover mr-3"
        />
        <div>
          <h4 className="text-sm font-medium text-gray-900">{kitten.name}</h4>
          <p className="text-xs text-gray-500">Niveau {kitten.level}</p>
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <div>
          <span className="text-gray-500">Force:</span> {kitten.strength}
        </div>
        <div>
          <span className="text-gray-500">Agilité:</span> {kitten.agility}
        </div>
        <div>
          <span className="text-gray-500">Constitution:</span> {kitten.constitution}
        </div>
        <div>
          <span className="text-gray-500">Intelligence:</span> {kitten.intelligence}
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Points de vie:</span> {maxHealth}
        </div>
      </div>
      
      {kitten.abilities.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-gray-500">Capacités: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {kitten.abilities.map((ability) => (
              <span key={ability.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                {ability.name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {kitten.stats && (
        <div className="mt-2 text-xs">
          <span className="text-gray-500">Bilan: </span>
          {kitten.stats.wins} V / {kitten.stats.losses} D / {kitten.stats.draws} N
        </div>
      )}
    </div>
  );
}
