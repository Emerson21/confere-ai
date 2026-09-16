'use client';

import React, { useState, useRef } from 'react';
import { Mic, Camera, Lock, Loader2, Sparkles } from 'lucide-react';

interface InputContainerProps {
  onSubmit: (content: string, contentType: 'text' | 'url' | 'image_base64') => void;
  isLoading?: boolean;
}

export const InputContainer: React.FC<InputContainerProps> = ({ onSubmit, isLoading = false }) => {
  const [inputText, setInputText] = useState('');
  const [audioRecording, setAudioRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const isUrl = /^https?:\/\/[^\s]+$/i.test(inputText.trim());
    onSubmit(inputText.trim(), isUrl ? 'url' : 'text');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Leitura amigável do arquivo
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Preencher indicação visual ou submeter diretamente
      setInputText((prev) =>
        prev
          ? `${prev}\n[Arquivo anexado: ${file.name}]`
          : `[Verificação de anexo: ${file.name}] Verifique os dados deste comprovante/boleto.`
      );
    };
    reader.readAsDataURL(file);
  };

  const handleAudioSimulate = () => {
    if (audioRecording) {
      setAudioRecording(false);
    } else {
      setAudioRecording(true);
      setTimeout(() => {
        setAudioRecording(false);
        setInputText(
          'Olá, meu sobrinho me pediu um Pix urgente no WhatsApp dizendo que trocou de número e precisa pagar uma conta hoje sem falta.'
        );
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Título de Boas-Vindas */}
      <div className="text-left space-y-1">
        <h2 className="text-3xl font-extrabold text-[#78350F] tracking-tight leading-tight">
          O que você deseja verificar hoje?
        </h2>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Caixa Principal de Entrada Multimodal */}
        <div className="w-full rounded-2xl border-2 border-teal-600 bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-700 transition">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Cole aqui a mensagem, link ou boleto suspeito..."
            rows={5}
            className="w-full p-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none resize-none min-h-[140px]"
            aria-label="Campo de entrada para mensagem suspeita"
          />

          {/* Barra de Ações Rápidas (Áudio e Foto) */}
          <div className="grid grid-cols-2 border-t border-gray-200 bg-gray-50/50 divide-x divide-gray-200">
            <button
              type="button"
              onClick={handleAudioSimulate}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold transition min-h-[48px] focus:outline-none focus:bg-teal-50 ${
                audioRecording ? 'text-red-600 bg-red-50 animate-pulse' : 'text-teal-700 hover:bg-teal-50'
              }`}
              aria-label="Gravar áudio com a dúvida"
            >
              <Mic className="w-5 h-5" />
              <span>{audioRecording ? 'Gravando...' : 'Gravar Áudio'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition min-h-[48px] focus:outline-none focus:bg-teal-50"
              aria-label="Tirar foto ou anexar imagem/boleto"
            >
              <Camera className="w-5 h-5" />
              <span>Tirar Foto/Upload</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              className="hidden"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Botão Primário de Ação */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base uppercase rounded-xl h-14 flex items-center justify-center transition shadow-md min-h-[48px] focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              CONFERINDO...
            </span>
          ) : (
            'VERIFICAR MENSAGEM'
          )}
        </button>
      </form>

      {/* Selo de Garantia de Privacidade */}
      <div className="w-full rounded-2xl bg-teal-50 border border-teal-200 p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-teal-900 font-medium leading-snug">
          <p className="font-bold">Sua privacidade é garantida.</p>
          <p className="text-teal-800/90">Nenhum dado pessoal é salvo.</p>
        </div>
      </div>
    </div>
  );
};
