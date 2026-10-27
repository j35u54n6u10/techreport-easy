import React, { useState } from 'react';
import { ReportData } from '../types.ts';
import { parseFromWhatsApp } from '../utils/formatter.ts';
import { X, ClipboardPaste, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportWhatsAppModalProps {
  onImport: (parsed: Partial<ReportData>) => void;
  onClose: () => void;
}

export const ImportWhatsAppModal: React.FC<ImportWhatsAppModalProps> = ({
  onImport,
  onClose,
}) => {
  const [pastedText, setPastedText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProcess = () => {
    if (!pastedText.trim()) return;

    try {
      const parsed = parseFromWhatsApp(pastedText);

      // Verify we found at least something
      if (!parsed.activityName && !parsed.objective && !parsed.date && !parsed.locationArea) {
        setErrorMsg('No se detectó la estructura oficial (📌1.- Nombre De la Actividad, etc.). Asegúrate de pegar el mensaje con el formato de puntos.');
        return;
      }

      onImport(parsed);
      onClose();
    } catch (e: any) {
      setErrorMsg('Error al procesar el texto: ' + e.message);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPastedText(text);
      }
    } catch (e) {
      // Permission denied or not supported, user can manually paste
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ClipboardPaste className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Importar desde Mensaje de WhatsApp</h3>
              <p className="text-xs text-slate-400">
                Pega el mensaje con los puntos 📌1 al 📌9 para cargarlo en el formulario.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Pega aquí el texto completo del reporte:
            </label>
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Pegar del portapapeles</span>
            </button>
          </div>

          <textarea
            rows={10}
            value={pastedText}
            onChange={(e) => {
              setPastedText(e.target.value);
              setErrorMsg(null);
            }}
            placeholder={`DIRECCIÓN REGIONAL DEL ESTADO BOLIVARIANO ARAGUA

📌1.- Nombre De la Actividad:
✓ Mantenimiento Correctivo...

📌2.- Objetivo O Finalidad:
...`}
            className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all leading-relaxed"
          />

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleProcess}
            disabled={!pastedText.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Cargar en el Formulario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
