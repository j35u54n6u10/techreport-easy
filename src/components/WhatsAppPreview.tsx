import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Send, 
  Printer, 
  Save, 
  Download, 
  Share2, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { ReportData } from '../types.ts';
import { formatToWhatsApp } from '../utils/formatter.ts';

interface WhatsAppPreviewProps {
  report: ReportData;
  onSave: () => void;
  onPrint: () => void;
  isSaved?: boolean;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  report,
  onSave,
  onPrint,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const formattedText = formatToWhatsApp(report);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = formattedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(formattedText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: report.activityName || 'Reporte Técnico',
          text: formattedText,
        });
      } catch (err) {
        console.warn('Share cancelled', err);
      }
    } else {
      handleSendWhatsApp();
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedTitle = (report.activityName || 'reporte')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 30);
    link.href = url;
    link.download = `Reporte_${report.date.replace(/\//g, '-')}_${sanitizedTitle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden sticky top-20">
      
      {/* WhatsApp Header bar */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs shadow-inner">
            AR
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Dirección Regional Aragua</div>
            <div className="text-[10px] text-emerald-200">Vista previa del mensaje de WhatsApp</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-100 transition-colors"
              title="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onPrint}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-100 transition-colors"
            title="Imprimir Ficha Técnica"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WhatsApp Chat Background simulator */}
      <div className="bg-[#EFEAE2] p-3 sm:p-4 max-h-[60vh] sm:max-h-[550px] overflow-y-auto space-y-2">
        
        {/* Date bubble */}
        <div className="flex justify-center">
          <span className="bg-white/80 backdrop-blur-xs text-[10px] text-slate-500 font-semibold px-2.5 py-0.5 rounded-md shadow-2xs">
            {report.date || 'HOY'}
          </span>
        </div>

        {/* The green message bubble */}
        <div className="flex justify-end">
          <div className="bg-[#E7FFDB] text-slate-900 rounded-lg p-3 sm:p-4 max-w-[95%] text-xs font-mono leading-relaxed shadow-sm border border-emerald-200/50 whitespace-pre-wrap select-all">
            {formattedText}
            
            <div className="text-right text-[10px] text-slate-400 mt-2 font-sans flex items-center justify-end gap-1">
              <span>{report.timeRange ? report.timeRange.replace('desde las ', '') : '11:30 am'}</span>
              <span className="text-blue-500 font-bold">✓✓</span>
            </div>
          </div>
        </div>

      </div>

      {/* Actions footer */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
        
        {/* Main COPY button (Prominent green) */}
        <button
          type="button"
          onClick={handleCopy}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
            copied
              ? 'bg-emerald-700 text-white ring-2 ring-emerald-500'
              : 'bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 hover:text-black font-extrabold'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>¡Copiado al Portapapeles! Listo para pegar</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copiar para WhatsApp</span>
            </>
          )}
        </button>

        {/* Secondary buttons */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
            title="Abrir WhatsApp Web o App directamente"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">Abrir WA</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
            title="Generar Ficha Técnica para imprimir y firmar"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate">Ficha PDF</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className={`inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-semibold border transition-colors shadow-2xs ${
              isSaved
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
            title="Guardar en historial del navegador"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span className="truncate">Guardado</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-purple-600" />
                <span className="truncate">Guardar</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Descargar archivo de texto (.txt)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
