'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchKittens } from '@/store/slices/kittenSlice';
import { fetchBattles } from '@/store/slices/battleSlice';
import Link from 'next/link';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { kittens, loading: kittensLoading } = useSelector((state: RootState) => state.kittens);
  const { battles, loading: battlesLoading } = useSelector((state: RootState) => state.battles);

  useEffect(() => {
    dispatch(fetchKittens());
    dispatch(fetchBattles());
  }, [dispatch]);

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Bienvenue, {user?.username} !
              </h2>
              <p className="text-gray-600">
                Voici un aperçu de vos chatons et combats récents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section des chatons */}
              <div className="bg-indigo-50 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-indigo-800">Mes Chatons</h3>
                  <Link
                    href="/kittens"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Voir tous
                  </Link>
                </div>
                
                {kittensLoading ? (
                  <p className="text-gray-600">Chargement...</p>
                ) : kittens.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Vous n&apos;avez pas encore de chatons</p>
                    <Link
                      href="/kittens/new"
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Créer un chaton
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {kittens.slice(0, 3).map((kitten) => (
                      <div key={kitten.id} className="flex items-center p-3 bg-white rounded shadow-sm">
                        {kitten.avatarUrl && (
                          <img
                            src={kitten.avatarUrl}
                            alt={kitten.name}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold">{kitten.name}</h4>
                          <p className="text-sm text-gray-600">
                            Niveau {kitten.level} - {kitten.stats ? `${kitten.stats.wins} Victoires` : '0 Victoires'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {kittens.length > 0 && (
                      <div className="mt-4">
                        <Link
                          href="/kittens/new"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          + Créer un nouveau chaton
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section des combats récents */}
              <div className="bg-purple-50 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-purple-800">Combats Récents</h3>
                  <Link
                    href="/battles"
                    className="text-purple-600 hover:text-purple-900"
                  >
                    Voir tous
                  </Link>
                </div>
                
                {battlesLoading ? (
                  <p className="text-gray-600">Chargement...</p>
                ) : battles.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Vous n&apos;avez pas encore de combats</p>
                    {kittens.length > 0 && (
                      <Link
                        href="/battles/new"
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Lancer un combat
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {battles.slice(0, 3).map((battle) => (
                      <div key={battle.id} className="p-3 bg-white rounded shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">{battle.challenger.name}</span> vs{' '}
                            <span className="font-medium">{battle.opponent.name}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(battle.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-sm">
                            {battle.winnerId
                              ? `Vainqueur: ${
                                  battle.winnerId === battle.challenger.id
                                    ? battle.challenger.name
                                    : battle.opponent.name
                                }`
                              : 'Match nul'}
                          </div>
                          <Link
                            href={`/battles/${battle.id}`}
                            className="text-xs text-purple-600 hover:text-purple-900"
                          >
                            Voir le détail
                          </Link>
                        </div>
                      </div>
                    ))}
                    {kittens.length > 0 && (
                      <div className="mt-4">
                        <Link
                          href="/battles/new"
                          className="text-purple-600 hover:text-purple-900"
                        >
                          + Lancer un nouveau combat
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
