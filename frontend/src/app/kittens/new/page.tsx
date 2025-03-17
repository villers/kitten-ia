'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { createKitten, clearError } from '@/store/slices/kittenSlice';
import Link from 'next/link';

export default function NewKittenPage() {
  const [name, setName] = useState('');
  const [strength, setStrength] = useState(5);
  const [agility, setAgility] = useState(5);
  const [constitution, setConstitution] = useState(5);
  const [intelligence, setIntelligence] = useState(5);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.kittens);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const kittenData = {
      name,
      strength,
      agility,
      constitution,
      intelligence,
      avatarUrl: avatarUrl || undefined,
    };
    
    const result = await dispatch(createKitten(kittenData));
    
    if (createKitten.fulfilled.match(result)) {
      router.push('/kittens');
    }
  };

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Créer un chaton</h1>
            <Link
              href="/kittens"
              className="px-4 py-2 text-sm text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Retour
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du chaton
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                  URL de l&apos;avatar (optionnel)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="avatarUrl"
                    name="avatarUrl"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Laissez vide pour utiliser un avatar aléatoire
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Statistiques</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chaque chaton commence avec 5 points dans chaque statistique.
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="strength" className="block text-sm font-medium text-gray-700">
                      Force: {strength}
                    </label>
                    <div className="mt-1">
                      <input
                        type="range"
                        id="strength"
                        name="strength"
                        min="1"
                        max="10"
                        className="w-full"
                        value={strength}
                        onChange={(e) => setStrength(parseInt(e.target.value))}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Augmente les dégâts des attaques physiques
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="agility" className="block text-sm font-medium text-gray-700">
                      Agilité: {agility}
                    </label>
                    <div className="mt-1">
                      <input
                        type="range"
                        id="agility"
                        name="agility"
                        min="1"
                        max="10"
                        className="w-full"
                        value={agility}
                        onChange={(e) => setAgility(parseInt(e.target.value))}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Améliore l&apos;initiative et l&apos;esquive
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="constitution" className="block text-sm font-medium text-gray-700">
                      Constitution: {constitution}
                    </label>
                    <div className="mt-1">
                      <input
                        type="range"
                        id="constitution"
                        name="constitution"
                        min="1"
                        max="10"
                        className="w-full"
                        value={constitution}
                        onChange={(e) => setConstitution(parseInt(e.target.value))}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Augmente les points de vie et la résistance
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="intelligence" className="block text-sm font-medium text-gray-700">
                      Intelligence: {intelligence}
                    </label>
                    <div className="mt-1">
                      <input
                        type="range"
                        id="intelligence"
                        name="intelligence"
                        min="1"
                        max="10"
                        className="w-full"
                        value={intelligence}
                        onChange={(e) => setIntelligence(parseInt(e.target.value))}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Augmente la puissance des capacités spéciales et de soin
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <Link
                    href="/kittens"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Création en cours...' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
