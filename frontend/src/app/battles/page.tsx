'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchBattles, BattleLog } from '@/store/slices/battleSlice';
import Link from 'next/link';

export default function BattlesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { battles, loading, error } = useSelector((state: RootState) => state.battles);
  const { kittens } = useSelector((state: RootState) => state.kittens);

  useEffect(() => {
    dispatch(fetchBattles());
  }, [dispatch]);

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Combats</h1>
          {kittens.length > 0 && (
            <Link
              href="/battles/new"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Lancer un combat
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <div className="text-center">
              <div className="spinner-border text-indigo-500" role="status">
                <span className="sr-only">Chargement...</span>
              </div>
              <p className="mt-2 text-gray-600">Chargement des combats...</p>
            </div>
          </div>
        ) : battles.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Aucun combat n&apos;a encore été lancé</h3>
            {kittens.length > 0 ? (
              <div className="mt-6">
                <Link
                  href="/battles/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Lancer un combat
                </Link>
              </div>
            ) : (
              <div className="mt-4 text-gray-600">
                <p>Vous devez d&apos;abord créer un chaton pour pouvoir lancer un combat.</p>
                <Link
                  href="/kittens/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Créer un chaton
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {battles.map((battle: BattleLog) => (
                <li key={battle.id}>
                  <Link href={`/battles/${battle.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-indigo-600 truncate">
                            {battle.challenger.name} vs {battle.opponent.name}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              battle.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {battle.status === 'COMPLETED' ? 'Terminé' : 'En cours'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(battle.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {battle.totalRounds} rounds
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          {battle.winnerId ? 
                            `Vainqueur: ${battle.winnerId === battle.challenger.id ? battle.challenger.name : battle.opponent.name}` :
                            'Match nul'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
