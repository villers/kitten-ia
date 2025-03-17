'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchKittens, Kitten } from '@/store/slices/kittenSlice';
import Link from 'next/link';

export default function KittensPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { kittens, loading, error } = useSelector((state: RootState) => state.kittens);

  useEffect(() => {
    dispatch(fetchKittens());
  }, [dispatch]);

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mes Chatons</h1>
          <Link
            href="/kittens/new"
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Créer un chaton
          </Link>
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
              <p className="mt-2 text-gray-600">Chargement des chatons...</p>
            </div>
          </div>
        ) : kittens.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Vous n&apos;avez pas encore de chatons</h3>
            <p className="mt-2 text-gray-600">Créez un chaton pour commencer à jouer !</p>
            <div className="mt-6">
              <Link
                href="/kittens/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Créer un chaton
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kittens.map((kitten: Kitten) => (
              <KittenCard key={kitten.id} kitten={kitten} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KittenCard({ kitten }: { kitten: Kitten }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={kitten.avatarUrl || 'https://placekitten.com/200/200'} 
              alt={kitten.name}
            />
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-medium text-gray-900">{kitten.name}</h3>
            <p className="text-sm text-gray-500">Niveau {kitten.level}</p>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Force</p>
              <p className="mt-1 text-sm text-gray-900">{kitten.strength}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Agilité</p>
              <p className="mt-1 text-sm text-gray-900">{kitten.agility}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Constitution</p>
              <p className="mt-1 text-sm text-gray-900">{kitten.constitution}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Intelligence</p>
              <p className="mt-1 text-sm text-gray-900">{kitten.intelligence}</p>
            </div>
          </div>
        </div>
        
        {kitten.stats && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Victoires</p>
                <p className="mt-1 text-sm text-gray-900">{kitten.stats.wins}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Défaites</p>
                <p className="mt-1 text-sm text-gray-900">{kitten.stats.losses}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nuls</p>
                <p className="mt-1 text-sm text-gray-900">{kitten.stats.draws}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-5">
          <Link
            href={`/kittens/${kitten.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Voir le détail
          </Link>
          
          {kitten.skillPoints > 0 && (
            <span className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {kitten.skillPoints} points disponibles
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
