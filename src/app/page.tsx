'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { InputContainer } from '@/components/InputContainer';
import { ProgressStepper } from '@/components/ProgressStepper';
import { ResultView } from '@/components/ResultView';
import { AnalysisResponse } from '@/domain/types/analysis';
import { AlertCircle, RefreshCw } from 'lucide-react';

type ScreenState = 'input' | 'analyzing' | 'result' | 'error';

export default function Home() {
  const [screenState, setScreenState] = useState<ScreenState>('input');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAnalyze = async (
    content: string,
    contentType: 'text' | 'url' | 'image_base64'
  ) => {
    setScreenState('analyzing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          contentType,
          userConsentAnonymization: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Erro na verificação (Código: ${response.status})`
        );
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);
      setScreenState('result');
    } catch (err: any) {
      console.error('Erro ao analisar conteúdo:', err);
      setErrorMessage(
        err.message || 'Ocorreu uma falha ao conectar com o serviço de checagem. Tente novamente.'
      );
      setScreenState('error');
    }
  };

  const handleReset = () => {
    setScreenState('input');
    setAnalysisResult(null);
    setErrorMessage('');
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Header unificado com logo e ícone do escudo */}
      <Header
        showBack={screenState === 'result' || screenState === 'error'}
        onBack={screenState !== 'input' && screenState !== 'analyzing' ? handleReset : undefined}
      />

      {/* Conteúdo Dinâmico por Estado */}
      <div className="flex-1 flex flex-col justify-start">
        {screenState === 'input' && (
          <InputContainer onSubmit={handleAnalyze} isLoading={false} />
        )}

        {screenState === 'analyzing' && <ProgressStepper />}

        {screenState === 'result' && analysisResult && (
          <ResultView analysis={analysisResult} onReset={handleReset} />
        )}

        {screenState === 'error' && (
          <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fadeIn text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Não foi possível concluir</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{errorMessage}</p>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition min-h-[48px] w-full shadow"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
