import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Zap, 
  Loader2, 
  HelpCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { ReportData } from '../types.ts';
import { DEFAULT_TEMPLATES } from '../data/defaults.ts';

interface QuickFillBarProps {
  onAiFill: (data: Partial<ReportData>) => void;
  onApplyTemplate: (templateId: string) => void;
}

export const QuickFillBar: React.FC<QuickFillBarProps> = ({
  onAiFill,
  onApplyTemplate,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);

  // Check Web Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setRecognitionSupported(Boolean(SpeechRecognition));
  }, []);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Puedes escribir tus notas en el campo de texto.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-VE'; // Spanish Venezuela
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleAiSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/parse-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo conectar al servicio de redacción');
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        onAiFill(resData.data);
        setPrompt('');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err: any) {
      console.warn('AI Parsing fallback:', err);
      setErrorMsg(err.message || 'Error procesando notas con IA. Prueba con una plantilla rápida abajo.');
      
      // Fallback: smart heuristic extraction if API is unreachable
      const lower = prompt.toLowerCase();
      const fallbackData: Partial<ReportData> = {};

      if (lower.includes('rj45') || lower.includes('jack') || lower.includes('red') || lower.includes('cable')) {
        const t = DEFAULT_TEMPLATES.find(x => x.id === 'rj45-red');
        if (t) {
          fallbackData.activityName = t.title;
          fallbackData.objective = t.defaultObjective;
        }
      } else if (lower.includes('preventivo') || lower.includes('limpieza') || lower.includes('mantenimiento')) {
        const t = DEFAULT_TEMPLATES.find(x => x.id === 'mantenimiento-preventivo');
        if (t) {
          fallbackData.activityName = t.title;
          fallbackData.objective = t.defaultObjective;
        }
      } else if (lower.includes('impresora') || lower.includes('toner') || lower.includes('imprimir')) {
        const t = DEFAULT_TEMPLATES.find(x => x.id === 'impresora-red');
        if (t) {
          fallbackData.activityName = t.title;
          fallbackData.objective = t.defaultObjective;
        }
      } else {
        fallbackData.objective = prompt;
      }

      onAiFill(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-blue-800/60 mb-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              Llenado Mágico: Escribe o dicta lo que hiciste
            </h2>
            <p className="text-xs text-blue-200/80">
              Pega tus notas desordenadas o habla por el micrófono; la IA lo convertirá en el informe oficial de 9 puntos.
            </p>
          </div>
        </div>

        {/* Quick hint badge */}
        <span className="hidden lg:inline-flex items-center text-[11px] font-medium text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-700/50">
          <Zap className="w-3 h-3 mr-1 text-amber-400" /> Ahorra 10 minutos por reporte
        </span>
      </div>

      {/* Input box with voice and submit */}
      <form onSubmit={handleAiSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Le cambié el conector de red a Ana Paula en agrario porque no tenía internet, fuimos Anyelina y yo a las 11:30am..."
            className="w-full bg-slate-950/80 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-4 pr-24 py-3 border border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-inner"
            disabled={isLoading}
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {recognitionSupported && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isListening ? 'Detener dictado' : 'Dictar por voz'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-900/40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Auto-Llenar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {errorMsg && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-300 bg-amber-950/60 border border-amber-800/80 rounded-lg px-3 py-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Template Shortcuts */}
      <div className="mt-3 pt-3 border-t border-blue-800/40 flex items-center flex-wrap gap-1.5 text-xs">
        <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-amber-400" /> O elige 1 clic:
        </span>

        {DEFAULT_TEMPLATES.slice(0, 4).map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onApplyTemplate(template.id)}
            className="px-2.5 py-1 rounded-lg bg-blue-950/90 hover:bg-blue-800/80 text-blue-100 border border-blue-700/60 text-[11px] font-medium transition-all hover:scale-[1.02] active:scale-95 truncate max-w-[200px] sm:max-w-none"
            title={template.title}
          >
            {template.id === 'rj45-red' && '🔌 '}
            {template.id === 'mantenimiento-preventivo' && '💻 '}
            {template.id === 'impresora-red' && '🖨️ '}
            {template.id === 'formateo-so' && '💾 '}
            {template.title.split(',')[0]}
          </button>
        ))}
      </div>

    </div>
  );
};
