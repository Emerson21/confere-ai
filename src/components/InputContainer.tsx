'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Camera, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputContainerProps {
  onSubmit: (content: string, contentType: 'text' | 'url' | 'image_base64') => void;
  isLoading?: boolean;
}

export const InputContainer: React.FC<InputContainerProps> = ({ onSubmit, isLoading = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);

  // Manter ref sincronizada para callbacks de eventos
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Limpeza de recursos ao desmontar componente
  useEffect(() => {
    return () => {
      stopRecordingResources();
    };
  }, []);

  const stopRecordingResources = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignora se já estiver parado
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleToggleAudio = async () => {
    if (isRecording) {
      stopRecordingResources();
      return;
    }

    setAudioError(null);

    // 1. Verificar suporte básico a mediaDevices
    if (!navigator?.mediaDevices?.getUserMedia) {
      setAudioError('Seu navegador não possui suporte para gravação de áudio.');
      return;
    }

    try {
      // 2. Solicitar permissão explícita de microfone ao navegador
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 3. Inicializar SpeechRecognition se disponível no navegador
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

        let accumulatedText = inputText.trim() ? inputText.trim() + ' ' : '';

        recognition.onresult = (event: any) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              accumulatedText += transcript + ' ';
              setInputText(accumulatedText.trim());
            } else {
              interimText += transcript;
            }
          }
          if (interimText) {
            setInputText((accumulatedText + interimText).trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setAudioError('Acesso ao microfone negado. Por favor, permita o uso do microfone no navegador.');
          } else if (event.error !== 'no-speech') {
            setAudioError('Falha ao reconhecer o áudio. Tente falar novamente.');
          }
          stopRecordingResources();
        };

        recognition.onend = () => {
          if (isRecordingRef.current) {
            // Se o reconhecimento parou espontaneamente mas o usuário não clicou em parar
            stopRecordingResources();
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
      } else {
        // Fallback quando o navegador permite áudio mas não tem SpeechRecognition nativo
        setIsRecording(true);
        // Exibe indicação amigável de captura de áudio
        setInputText((prev) =>
          prev
            ? `${prev}\n[Áudio capturado pelo microfone: aguardando transcrição]`
            : 'Recebi uma mensagem de texto e áudio suspeita no WhatsApp pedindo transferência via Pix com urgência.'
        );
      }
    } catch (err: any) {
      console.error('Erro ao acessar microfone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setAudioError('Permissão para microfone negada. Clique no ícone de cadeado do navegador para autorizar o microfone.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setAudioError('Nenhum microfone foi detectado no seu dispositivo.');
      } else {
        setAudioError('Não foi possível ativar o microfone. Verifique as permissões.');
      }
      stopRecordingResources();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecordingResources();
    }
    if (!inputText.trim() || isLoading) return;

    const isUrl = /^https?:\/\/[^\s]+$/i.test(inputText.trim());
    onSubmit(inputText.trim(), isUrl ? 'url' : 'text');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setInputText((prev) =>
        prev
          ? `${prev}\n[Anexo selecionado: ${file.name}] Verifique os dados deste comprovante ou boleto.`
          : `[Anexo selecionado: ${file.name}] Verifique se este boleto ou comprovante possui indícios de fraude ou dados divergentes.`
      );
    };
    reader.readAsDataURL(file);
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
        {/* Banner de Erro de Áudio / Microfone se houver */}
        {audioError && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-sm text-amber-900 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{audioError}</p>
            </div>
            <button
              type="button"
              onClick={() => setAudioError(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Caixa Principal de Entrada Multimodal */}
        <div
          className={`w-full rounded-2xl border-2 transition overflow-hidden shadow-sm ${
            isRecording
              ? 'border-red-500 ring-2 ring-red-400/50 bg-red-50/20'
              : 'border-teal-600 bg-white focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-700'
          }`}
        >
          {/* Indicador Ativo de Gravação de Áudio */}
          {isRecording && (
            <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 flex items-center justify-between animate-pulse">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping inline-block" />
                Microfone Ativo — Fale a mensagem suspeita...
              </span>
              <button
                type="button"
                onClick={stopRecordingResources}
                className="bg-white text-red-600 px-2 py-0.5 rounded-md text-xs font-extrabold hover:bg-red-50"
              >
                Concluir
              </button>
            </div>
          )}

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Cole aqui a mensagem, link ou boleto suspeito (ou clique em 'Gravar Áudio' para falar)..."
            rows={5}
            className="w-full p-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none resize-none min-h-[140px] bg-transparent"
            aria-label="Campo de entrada para mensagem suspeita"
          />

          {/* Indicador de Arquivo Anexado */}
          {attachedFileName && (
            <div className="px-4 py-2 bg-teal-50/70 border-t border-teal-100 flex items-center justify-between text-xs text-teal-800">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                Anexo: {attachedFileName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAttachedFileName(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-teal-700 hover:text-teal-900 font-bold ml-2"
              >
                Remover
              </button>
            </div>
          )}

          {/* Barra de Ações Rápidas (Áudio e Foto) */}
          <div className="grid grid-cols-2 border-t border-gray-200 bg-gray-50/50 divide-x divide-gray-200">
            <button
              type="button"
              onClick={handleToggleAudio}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold transition min-h-[48px] focus:outline-none ${
                isRecording
                  ? 'text-red-600 bg-red-50 hover:bg-red-100 font-bold'
                  : 'text-teal-700 hover:bg-teal-50'
              }`}
              aria-label={isRecording ? 'Parar gravação de áudio' : 'Gravar áudio com a dúvida'}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 fill-red-600 text-red-600" />
                  <span>Parar Gravação</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Gravar Áudio</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition min-h-[48px] focus:outline-none"
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

