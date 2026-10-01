import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Camera,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileAudio,
} from 'lucide-react';

interface InputContainerProps {
  onSubmit: (content: string, contentType: 'text' | 'url' | 'image_base64') => void;
  isLoading?: boolean;
}

export const InputContainer: React.FC<InputContainerProps> = ({ onSubmit, isLoading = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedImageBase64, setAttachedImageBase64] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeAudioInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognizedRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const isUnmountedRef = useRef<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);


  // Manter ref sincronizada para callbacks de eventos
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Timer de gravação com limite de 60 segundos
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 59) {
            stopRecordingResources(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRecording]);

  // Limpeza de recursos ao desmontar componente
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      stopRecordingResources(true);
    };
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const cancelRecording = () => {
    speechRecognizedRef.current = true; // evita disparar /api/transcribe
    audioChunksRef.current = [];
    stopRecordingResources(false);
    setAudioError(null);
  };

  const stopRecordingResources = (isUnmounting = false) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        if (isUnmounting) {
          mediaRecorderRef.current.onstop = null;
        } else {
          // Garante que todo o buffer de áudio seja despejado antes de parar
          mediaRecorderRef.current.requestData();
        }
        mediaRecorderRef.current.stop();
      } catch (e) {
        // Ignora se já estiver parado
      }
    }
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

    // 1. Verificar suporte a mediaDevices (requer HTTPS ou localhost no mobile)
    if (!navigator?.mediaDevices?.getUserMedia) {
      setAudioError(
        'Seu navegador não liberou acesso ao microfone ou requer conexão segura HTTPS para ativar a gravação de áudio.'
      );
      return;
    }

    try {
      // 2. Solicitar acesso ao microfone
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({audio: true});

      // 3. Configurar formato de áudio suportado pelo navegador móvel
      let selectedMimeType = '';
      if (typeof MediaRecorder !== 'undefined') {
        const candidateTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
          'audio/aac',
          'audio/ogg;codecs=opus',
        ];
        for (const type of candidateTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            selectedMimeType = type;
            break;
          }
        }
      }

      audioChunksRef.current = [];
      speechRecognizedRef.current = false;

      let mediaRecorder: MediaRecorder | null = null;
      try {
        mediaRecorder = selectedMimeType
          ? new MediaRecorder(stream, { mimeType: selectedMimeType })
          : new MediaRecorder(stream);
      } catch {
        mediaRecorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (isUnmountedRef.current) return;

        // Libera os tracks do microfone
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }

        // Se o SpeechRecognition nativo já transcreveu texto, não precisamos chamar o servidor
        if (speechRecognizedRef.current) {
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: selectedMimeType || 'audio/webm',
        });

        // Se o áudio gravado for menor que 100 bytes, ignora clique acidental
        if (audioBlob.size < 100) {
          return;
        }


        setIsTranscribing(true);
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            if (isUnmountedRef.current) return;
            const base64Audio = typeof reader.result === 'string' ? reader.result : '';
            if (!base64Audio) {
              setIsTranscribing(false);
              return;
            }

            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Audio,
                  mimeType: selectedMimeType || 'audio/webm',
                }),
              });

              if (res.ok) {
                const data = await res.json();
                if (data.transcription && data.transcription.trim()) {
                  setInputText((prev) =>
                    prev.trim()
                      ? `${prev.trim()} ${data.transcription.trim()}`
                      : data.transcription.trim()
                  );
                } else {
                  setAudioError(
                    'Não identificamos palavras audíveis no áudio. Fale mais próximo ao microfone e tente novamente.'
                  );
                }
              } else {
                setAudioError('Falha ao transcrever o áudio com a IA. Tente falar novamente.');
              }
            } catch (err) {
              console.error('Erro na chamada /api/transcribe:', err);
              setAudioError('Erro de conexão ao processar áudio.');
            } finally {
              if (!isUnmountedRef.current) {
                setIsTranscribing(false);
              }
            }
          };
          reader.readAsDataURL(audioBlob);
        } catch (err) {
          console.error('Erro ao ler dados de áudio:', err);
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start(250);

      // 4. Em paralelo, tentar SpeechRecognition se disponível (otimizado para mobile)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'pt-BR';
          recognition.continuous = false; // continuous: false é crucial para estabilidade em mobile
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                speechRecognizedRef.current = true;
                setInputText((prev) =>
                  prev.trim() ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()
                );
              }
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('SpeechRecognition aviso no mobile:', event.error);
          };

          recognition.onend = () => {
            if (isRecordingRef.current) {
              try {
                recognition.start();
              } catch {
                // MediaRecorder continuará gravando
              }
            }
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch (speechErr) {
          console.warn('SpeechRecognition não pôde ser iniciado, usando gravação com Gemini:', speechErr);
        }
      }

      setIsRecording(true);
    } catch (err: any) {
      console.error('Erro ao acessar microfone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setAudioError(
          'Permissão para microfone negada. No celular, toque no ícone de configurações/cadeado da barra do navegador e autorize o microfone.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setAudioError('Nenhum microfone foi detectado no seu aparelho.');
      } else {
        setAudioError('Não foi possível ativar o microfone. Verifique as permissões do navegador.');
      }
      stopRecordingResources();
    }
  };


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecordingResources();
    }
    if ((!inputText.trim() && !attachedImageBase64) || isLoading) return;

    if (attachedImageBase64) {
      const payload = inputText.trim()
        ? `${attachedImageBase64}\n${inputText.trim()}`
        : attachedImageBase64;
      onSubmit(payload, 'image_base64');
      return;
    }

    const isUrl = /^https?:\/\/[^\s]+$/i.test(inputText.trim());
    onSubmit(inputText.trim(), isUrl ? 'url' : 'text');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);

    // 1. Suporte a arquivos de áudio (WhatsApp, gravações do sistema: .ogg, .opus, .mp3, .m4a, etc.)
    const isAudioFile =
      file.type.startsWith('audio/') ||
      /\.(ogg|opus|mp3|m4a|wav|aac|webm|amr)$/i.test(file.name);

    if (isAudioFile) {
      setIsTranscribing(true);
      setAudioError(null);
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        if (!dataUrl) {
          setIsTranscribing(false);
          return;
        }

        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: dataUrl,
              mimeType: file.type || 'audio/ogg',
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.transcription && data.transcription.trim()) {
              setInputText((prev) =>
                prev.trim()
                  ? `${prev.trim()}\n[Áudio anexado - ${file.name}]: ${data.transcription.trim()}`
                  : `[Áudio anexado - ${file.name}]: ${data.transcription.trim()}`
              );
            } else {
              setAudioError(
                `Não identificamos palavras audíveis no arquivo de áudio "${file.name}".`
              );
            }
          } else {
            setAudioError(`Falha ao transcrever o arquivo de áudio "${file.name}".`);
          }
        } catch (err) {
          console.error('Erro ao transcrever arquivo de áudio:', err);
          setAudioError('Erro de conexão ao processar o arquivo de áudio.');
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // 2. Se for imagem ou documento
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;

      // Se for imagem, redimensiona se for muito grande para garantir envio rápido
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setAttachedImageBase64(compressedDataUrl);
          } else {
            setAttachedImageBase64(dataUrl);
          }
        };
        img.onerror = () => {
          setAttachedImageBase64(dataUrl);
        };
        img.src = dataUrl;
      } else {
        setAttachedImageBase64(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Título de Boas-Vindas */}
      <div className="text-left space-y-1">
        <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight leading-tight">
          O que você deseja verificar hoje?
        </h2>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Banner de Erro de Áudio / Microfone com Ações Alternativas */}
        {audioError && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-3.5 text-sm text-amber-900 space-y-2.5 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold leading-snug">{audioError}</p>
              </div>
              <button
                type="button"
                onClick={() => setAudioError(null)}
                className="text-amber-700 hover:text-amber-900 text-xs font-bold px-1"
                aria-label="Fechar aviso"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1 border-t border-amber-200">
              <button
                type="button"
                onClick={() => nativeAudioInputRef.current?.click()}
                className="text-xs font-bold text-teal-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <Mic className="w-3.5 h-3.5 text-teal-700" />
                Gravar com aplicativo nativo do celular
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-teal-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <FileAudio className="w-3.5 h-3.5 text-teal-700" />
                Anexar áudio (WhatsApp / Gravador)
              </button>
            </div>
          </div>
        )}

        {/* Caixa Principal de Entrada Multimodal */}
        <div
          className={`w-full rounded-2xl border-2 transition overflow-hidden shadow-sm ${
            isRecording
              ? 'border-red-500 ring-2 ring-red-400/50 bg-red-50/20'
              : isTranscribing
              ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/10'
              : 'border-brand-dark bg-white focus-within:ring-2 focus-within:ring-brand-teal focus-within:border-brand-dark'
          }`}
        >
          {/* Indicador Ativo de Gravação de Áudio com Cronômetro */}
          {isRecording && (
            <div className="bg-red-500 text-white text-xs font-bold px-4 py-2.5 flex items-center justify-between animate-pulse">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping inline-block" />
                Gravando ({formatSeconds(recordingSeconds)} / 01:00)...
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stopRecordingResources(false)}
                  className="bg-white text-red-600 px-2.5 py-1 rounded-md text-xs font-extrabold hover:bg-red-50 shadow-sm"
                >
                  Concluir
                </button>
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="bg-red-700 text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-red-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Indicador de Transcrição de Áudio com IA */}
          {isTranscribing && (
            <div className="bg-teal-700 text-white text-xs font-bold px-4 py-2.5 flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                Transcrevendo áudio com inteligência artificial...
              </span>
            </div>
          )}

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || isTranscribing}
            placeholder={
              attachedFileName
                ? 'Arquivo anexado! Clique em VERIFICAR MENSAGEM abaixo ou adicione um comentário opcional aqui...'
                : isTranscribing
                ? 'Transcrevendo sua fala com inteligência artificial...'
                : "Cole aqui a mensagem, link ou boleto suspeito (ou clique em 'Gravar Áudio' para falar)..."
            }
            rows={5}
            className="w-full p-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none resize-none min-h-[140px] bg-transparent"
            aria-label="Campo de entrada para mensagem suspeita"
          />

          {/* Indicador de Arquivo Anexado */}
          {attachedFileName && (
            <div className="px-4 py-2.5 bg-brand-mint border-t border-brand-mintBorder flex items-center justify-between text-xs text-brand-dark gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {attachedImageBase64 && attachedImageBase64.startsWith('data:image/') ? (
                  <img
                    src={attachedImageBase64}
                    alt="Miniatura do anexo"
                    className="w-10 h-10 rounded-lg object-cover border border-brand-mintBorder flex-shrink-0"
                  />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                )}
                <div className="truncate">
                  <p className="font-bold text-brand-dark truncate">Anexo: {attachedFileName}</p>
                  <p className="text-[11px] text-brand-dark/70">Leitura pronta para análise</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAttachedFileName(null);
                  setAttachedImageBase64(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  if (nativeAudioInputRef.current) nativeAudioInputRef.current.value = '';
                }}
                className="text-brand-dark hover:text-brand-teal font-bold ml-2 flex-shrink-0"
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
              disabled={isLoading || isTranscribing}
              className={`flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold transition min-h-[48px] focus:outline-none ${
                isRecording
                  ? 'text-red-600 bg-red-50 hover:bg-red-100 font-bold'
                  : isTranscribing
                  ? 'text-teal-700 opacity-60 cursor-wait'
                  : 'text-teal-700 hover:bg-teal-50'
              }`}
              aria-label={isRecording ? 'Parar gravação de áudio' : 'Gravar áudio com a dúvida'}
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                  <span>Transcrevendo...</span>
                </>
              ) : isRecording ? (
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
              disabled={isLoading || isTranscribing}
              className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition min-h-[48px] focus:outline-none"
              aria-label="Tirar foto, anexar imagem ou arquivo de áudio"
            >
              <Camera className="w-5 h-5" />
              <span>Foto / Áudio / Doc</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf,audio/*,.ogg,.opus,.mp3,.m4a,.wav,.aac"
              className="hidden"
              aria-hidden="true"
            />

            <input
              type="file"
              ref={nativeAudioInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              capture="user"
              className="hidden"
              aria-hidden="true"
            />

          </div>
        </div>


        {/* Botão Primário de Ação */}
        <button
          type="submit"
          disabled={(!inputText.trim() && !attachedImageBase64) || isLoading || isTranscribing}
          className="w-full bg-brand-teal text-brand-dark hover:bg-brand-dark hover:text-white active:bg-brand-darkActive active:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base uppercase rounded-xl h-14 flex items-center justify-center transition shadow-md min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2"
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
      <div className="w-full rounded-2xl bg-brand-mint border border-brand-mintBorder p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center flex-shrink-0 text-white">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-brand-dark font-medium leading-snug">
          <p className="font-bold">Sua privacidade é garantida.</p>
          <p className="text-brand-dark/70">Nenhum dado pessoal é salvo.</p>
        </div>
      </div>
    </div>
  );
};

