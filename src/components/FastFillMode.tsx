import React, { useState, useEffect } from 'react';
import { ReportData, Technician } from '../types.ts';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  Send, 
  Download, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Loader2, 
  AlertCircle,
  FileText,
  User,
  Share2,
  ChevronRight
} from 'lucide-react';
import { 
  formatToWhatsApp, 
  getTodayFormatted, 
  getYesterdayFormatted, 
  getCurrentTimeFormatted 
} from '../utils/formatter.ts';
import { DEFAULT_TEMPLATES } from '../data/defaults.ts';

interface FastFillModeProps {
  report: ReportData;
  onChange: (updated: ReportData) => void;
  availableTechnicians: Technician[];
  onOpenAdvanced: () => void;
  onOpenWhatsAppPreview?: () => void;
}

export const FastFillMode: React.FC<FastFillModeProps> = ({
  report,
  onChange,
  availableTechnicians,
  onOpenAdvanced,
  onOpenWhatsAppPreview,
}) => {
  const [whatIDid, setWhatIDid] = useState(report.objective || '');
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Common courts / tribunals in Aragua
  const courts = [
    {
      id: 'agrario',
      name: 'Circuito Agrario',
      badge: 'Maracay',
      sede: 'Circuito de Protección Maracay estado Aragua, edif Raila 2 c/c Paez y Sucre',
      area: 'Circuito Judicial Agrario',
      beneficiaries: 'Funcionarios y personal adscrito al Circuito Judicial Agrario',
    },
    {
      id: 'proteccion',
      name: 'Protección (Raila 2)',
      badge: 'Páez y Sucre',
      sede: 'Circuito de Protección Maracay estado Aragua, edif Raila 2 c/c Paez y Sucre',
      area: 'Área Circuito de Protección de Niños, Niñas y Adolescentes',
      beneficiaries: 'Jueces, secretarios y personal del Circuito de Protección',
    },
    {
      id: 'palacio',
      name: 'Palacio de Justicia',
      badge: 'Av. Bolívar',
      sede: 'Palacio de Justicia del Estado Aragua, Av. Bolívar Oeste, Maracay',
      area: 'Juzgados de Municipio / Sala de Audiencias',
      beneficiaries: 'Personal judicial y usuarios del tribunal',
    },
    {
      id: 'penal',
      name: 'Circuito Penal',
      badge: 'Maracay',
      sede: 'Palacio de Justicia del Estado Aragua, Av. Bolívar Oeste, Maracay',
      area: 'Área Circuito Judicial Penal',
      beneficiaries: 'Jueces y secretarios de control y juicio',
    },
    {
      id: 'laboral',
      name: 'Circuito Laboral',
      badge: 'Edif. Los Mangos',
      sede: 'Circuito Judicial Laboral del Estado Aragua, Edificio Los Mangos, Maracay',
      area: 'Tribunales de Sustanciación, Mediación y Ejecución',
      beneficiaries: 'Personal del Circuito Laboral y usuarios',
    },
    {
      id: 'archivo',
      name: 'Archivo Central / URDD',
      badge: 'Expedientes',
      sede: 'Circuito de Protección Maracay estado Aragua, edif Raila 2 c/c Paez y Sucre',
      area: 'Unidad de Recepción y Archivo General',
      beneficiaries: 'Personal de la URDD y archivo de expedientes',
    },
  ];

  // Sync whatIDid when report.objective changes externally
  useEffect(() => {
    if (report.objective && !whatIDid) {
      setWhatIDid(report.objective);
    }
  }, [report.objective]);

  // Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu teléfono no soporta dictado directo. Escribe lo que hiciste en el campo de texto.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-VE';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const updated = whatIDid ? `${whatIDid} ${transcript}` : transcript;
        setWhatIDid(updated);
        handleUpdateObjective(updated);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleUpdateObjective = (text: string) => {
    setWhatIDid(text);
    let actName = report.activityName;
    const lower = text.toLowerCase();
    if (!actName || actName === 'Soporte Técnico' || actName.includes('Mantenimiento')) {
      if (lower.includes('rj45') || lower.includes('jack') || lower.includes('conector') || lower.includes('cable') || lower.includes('red')) {
        actName = 'Mantenimiento Correctivo, Reemplazo de Jack Modular RJ45 y Restablecimiento de Conectividad en Red Local';
      } else if (lower.includes('preventivo') || lower.includes('limpieza') || lower.includes('polvo')) {
        actName = 'Mantenimiento Preventivo Físico y Lógico de Estación de Trabajo';
      } else if (lower.includes('impresora') || lower.includes('toner') || lower.includes('imprimir')) {
        actName = 'Configuración, Instalación y Compartición de Impresora en Red Local';
      } else if (lower.includes('clave') || lower.includes('contraseña') || lower.includes('dominio') || lower.includes('desbloqueo')) {
        actName = 'Restablecimiento de Credenciales de Dominio y Desbloqueo de Usuario';
      } else if (lower.includes('formateo') || lower.includes('sistema operativo') || lower.includes('windows')) {
        actName = 'Formateo, Reinstalación de Sistema Operativo y Respaldo de Datos';
      } else if (!actName) {
        actName = text.length > 60 ? `${text.substring(0, 60)}...` : text;
      }
    }

    onChange({
      ...report,
      objective: text,
      activityName: actName,
      updatedAt: Date.now(),
    });
  };

  // AI Improve
  const handleAutoPolishWithAI = async () => {
    if (!whatIDid.trim()) return;
    setIsImproving(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: whatIDid,
          activityName: report.activityName,
          locationArea: report.locationArea,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo procesar');
      }

      const data = await res.json();
      if (data.success && data.improvedText) {
        setWhatIDid(data.improvedText);
        onChange({
          ...report,
          objective: data.improvedText,
          updatedAt: Date.now(),
        });
      }
    } catch (err: any) {
      setAiError('No se pudo conectar con el asistente de redacción.');
    } finally {
      setIsImproving(false);
    }
  };

  // Quick Court Selection
  const handleSelectCourt = (court: typeof courts[0]) => {
    onChange({
      ...report,
      locationArea: court.area,
      sede: court.sede,
      beneficiaries: court.beneficiaries,
      updatedAt: Date.now(),
    });
  };

  // Toggle Technician Helper
  const handleToggleTech = (tech: Technician) => {
    const formatted = `${tech.name} ${tech.role}`.trim();
    const current = report.technicians || [];
    const exists = current.some((t) => t.toLowerCase().includes(tech.name.toLowerCase()));

    let updated: string[];
    if (exists) {
      updated = current.filter((t) => !t.toLowerCase().includes(tech.name.toLowerCase()));
    } else {
      updated = [...current, formatted];
    }

    onChange({
      ...report,
      technicians: updated,
      updatedAt: Date.now(),
    });
  };

  const handleOnlyMe = () => {
    const julio = availableTechnicians.find((t) => t.name.toLowerCase().includes('julio'));
    const aloneList = julio ? [`${julio.name} ${julio.role}`] : ['Julio Técnico de Soporte'];
    onChange({
      ...report,
      technicians: aloneList,
      updatedAt: Date.now(),
    });
  };

  // Quick Action Template Presets
  const handleQuickAction = (templateId: string) => {
    const tpl = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;

    setWhatIDid(tpl.defaultObjective);
    onChange({
      ...report,
      activityName: tpl.title,
      objective: tpl.defaultObjective,
      materialsUsed: tpl.suggestedMaterials || report.materialsUsed,
      updatedAt: Date.now(),
    });
  };

  // Copy WhatsApp Formatted Message
  const formattedText = formatToWhatsApp(report);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = formattedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download .TXT
  const handleDownloadTxt = () => {
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${report.date.replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Open WhatsApp Web/App
  const handleOpenWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: report.activityName || 'Reporte Técnico',
          text: formattedText,
        });
      } catch (err) {}
    } else {
      handleOpenWhatsApp();
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-5 pb-20 md:pb-6">
      
      {/* 1. EL ÚNICO CAMPO A ESCRIBIR */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border-2 border-emerald-500/50 shadow-sm relative transition-all">
        <div className="flex items-center justify-between mb-2 gap-2">
          <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] sm:text-xs font-black shadow-xs">
              1
            </span>
            <span>¿Qué hiciste? (Lo único que escribes)</span>
          </label>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleListening}
              className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
              }`}
              title="Dictar por voz"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
              <span className="hidden xs:inline">{isListening ? 'Grabando...' : 'Dictar'}</span>
            </button>

            <button
              type="button"
              onClick={handleAutoPolishWithAI}
              disabled={isImproving || !whatIDid.trim()}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all disabled:opacity-50 active:scale-95"
              title="Perfeccionar redacción técnica con IA"
            >
              {isImproving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span className="hidden xs:inline">Pulir IA</span>
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={whatIDid}
          onChange={(e) => handleUpdateObjective(e.target.value)}
          placeholder="Escribe lo que hiciste o pulsa Dictar: ej: Le cambié el conector RJ45 a Ana Paula en agrario porque no le abrían las carpetas..."
          className="w-full text-sm sm:text-base text-slate-900 bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all leading-relaxed placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm"
        />

        {aiError && (
          <p className="mt-1 text-xs text-amber-700 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {aiError}
          </p>
        )}

        {/* Atajos Rápidos de 1 toque */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
            Típico:
          </span>
          <button
            type="button"
            onClick={() => handleQuickAction('rj45-red')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold whitespace-nowrap active:scale-95 transition-transform"
          >
            🔌 Jack RJ45
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('mantenimiento-preventivo')}
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold whitespace-nowrap active:scale-95 transition-transform"
          >
            💻 Preventivo
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('impresora-red')}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold whitespace-nowrap active:scale-95 transition-transform"
          >
            🖨️ Impresora
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('credenciales-dominio')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold whitespace-nowrap active:scale-95 transition-transform"
          >
            🔐 Clave
          </button>
        </div>
      </div>

      {/* 2. ¿EN QUÉ TRIBUNAL FUE? */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm">
        <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 mb-2">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] sm:text-xs font-black shadow-xs">
            2
          </span>
          <span>¿En qué Tribunal fue? (Toca uno, no escribas)</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {courts.map((court) => {
            const isSelected =
              report.locationArea.toLowerCase().includes(court.area.toLowerCase()) ||
              report.locationArea.toLowerCase().includes(court.id);

            return (
              <button
                key={court.id}
                type="button"
                onClick={() => handleSelectCourt(court)}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all font-medium text-xs flex flex-col justify-between active:scale-[0.97] min-h-[62px] ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                  <span className="font-bold truncate">{court.name}</span>
                </div>
                <span className={`text-[10px] mt-1 truncate ${isSelected ? 'text-blue-100 font-normal' : 'text-slate-400'}`}>
                  {court.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ¿QUIÉN TE AYUDÓ? */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] sm:text-xs font-black shadow-xs">
              3
            </span>
            <span>¿Quién te ayudó? (Toca los nombres)</span>
          </label>

          <button
            type="button"
            onClick={handleOnlyMe}
            className="text-[11px] font-bold text-slate-500 hover:text-purple-600 px-2 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 transition-colors active:scale-95"
          >
            Fui yo solo
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {availableTechnicians.map((tech) => {
            const isSelected = (report.technicians || []).some((t) =>
              t.toLowerCase().includes(tech.name.toLowerCase())
            );

            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => handleToggleTech(tech)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{tech.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${isSelected ? 'bg-purple-700 text-purple-100' : 'bg-slate-200 text-slate-600'}`}>
                  {tech.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FECHA Y HORA AUTOMÁTICAS */}
      <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
            📅 Fecha (Auto):
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {report.date}
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...report, date: getYesterdayFormatted(), updatedAt: Date.now() })}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              ¿Ayer?
            </button>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
            🕒 Hora (Auto):
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 truncate">
              {report.timeRange || getCurrentTimeFormatted()}
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...report, timeRange: getCurrentTimeFormatted(), updatedAt: Date.now() })}
              className="text-[11px] text-blue-600 font-bold hover:underline shrink-0"
            >
              Ahora
            </button>
          </div>
        </div>
      </div>

      {/* 5. VISTA PREVIA Y ACCIONES DESTACADAS */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-5 shadow-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-bold text-xs sm:text-sm text-emerald-300">
              Formato Oficial Listo para Enviar
            </span>
          </div>

          {onOpenWhatsAppPreview && (
            <button
              type="button"
              onClick={onOpenWhatsAppPreview}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>Ver chat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Vista previa en caja de texto */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-100 max-h-40 overflow-y-auto whitespace-pre-wrap select-all leading-relaxed">
          {formattedText}
        </div>

        {/* Botón Gigante de Copiar */}
        <button
          type="button"
          onClick={handleCopy}
          className={`w-full py-3.5 sm:py-4 px-4 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
            copied
              ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40'
              : 'bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-white stroke-[3]" />
              <span>¡COPIADO! PÉGALO EN WHATSAPP</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 stroke-[2.5]" />
              <span>COPIAR FORMATO PARA WHATSAPP</span>
            </>
          )}
        </button>

        {/* Botones secundarios TXT y Enviar */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="truncate">Descargar .TXT</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="py-2.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 font-bold flex items-center justify-center gap-1.5 border border-emerald-800 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 text-[#25D366]" />
            <span className="truncate">Enviar a WhatsApp</span>
          </button>
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onOpenAdvanced}
            className="text-[11px] text-slate-400 hover:text-white underline font-medium"
          >
            ¿Quieres ajustar un punto a mano? Abrir los 9 Puntos Detallados
          </button>
        </div>

      </div>

      {/* STICKY BOTTOM QUICK-COPY BAR ON PHONES */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 px-3 py-2 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-2 shadow-xl">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
            copied ? 'bg-emerald-600 text-white' : 'bg-[#25D366] text-slate-950'
          }`}
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '¡Copiado!' : 'Copiar Formato'}</span>
        </button>

        <button
          type="button"
          onClick={handleNativeShare}
          className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 active:scale-95 transition-all"
          title="Compartir o enviar por WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleDownloadTxt}
          className="p-2.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 active:scale-95 transition-all"
          title="Descargar archivo TXT"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
