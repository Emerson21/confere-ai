'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBack, showBack = false }) => {
  return (
    <header className="w-full bg-brand-dark text-white shadow-sm py-4 px-4 sticky top-0 z-30 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(showBack || onBack) && (
            <button
              onClick={onBack}
              aria-label="Voltar"
              className="p-2 -ml-2 rounded-full hover:bg-teal-700 active:bg-teal-800 transition min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          )}

          <div className="flex items-center gap-2" aria-label="Logo Confere Aí">
            <Image
              src="/logo_ca.svg"
              alt="Logo Confere Aí"
              width={40}
              height={40}
              className="logo"
              priority
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                Confere Aí
              </h1>
              <p className="text-xs text-teal-100 font-medium hidden sm:block">
                Antes de acreditar, clicar ou compartilhar, confira
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-700 text-teal-100 border border-teal-500/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Privado
          </span>
        </div>
      </div>
    </header>
  );
};
