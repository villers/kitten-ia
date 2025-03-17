'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Home() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Kitten-IA</h1>
        <p className="text-xl mb-8">Un jeu de combat de chatons inspiré par &quot;LabrUte&quot;</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            href="/login"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
          >
            Inscription
          </Link>
        </div>
        
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Comment jouer ?</h2>
          <p className="mb-4">
            Dans Kitten-IA, vous créez et entraînez des chatons de combat avec différentes statistiques et compétences.
          </p>
          <p className="mb-4">
            Lancez des combats contre d&apos;autres chatons, gagnez de l&apos;expérience et améliorez vos compétences pour
            devenir le maître des chatons !
          </p>
          <p>
            Chaque combat est automatisé, mais vous pouvez voir chaque étape du combat en détail pour comprendre
            comment améliorer vos stratégies.
          </p>
        </div>
      </div>
    </main>
  );
}
