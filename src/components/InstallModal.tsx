import React from 'react';
import { X, Smartphone, Download, CheckCircle2, ArrowRight, Share2, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

interface InstallModalProps {
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose }) => {
  const { isInstallable, install, isIOS, isAndroid, isInstalled } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Instalar App en tu Teléfono (APK)</h3>
              <p className="text-xs text-emerald-200">
                Llévala en tu pantalla de inicio como una aplicación nativa.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          
          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">¡La aplicación ya está instalada!</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Ya puedes abrirla directamente desde el icono en la pantalla de tu teléfono.
                </p>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="space-y-3">
              <p className="text-slate-600 leading-relaxed">
                Tu navegador permite instalar la aplicación directamente con un solo toque:
              </p>
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>Instalar Aplicación en Android</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-800">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Pasos para instalar en Android (Google Chrome):</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      En Chrome, toca los <strong>tres puntos verticales (⋮)</strong> en la esquina superior derecha.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Selecciona la opción <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Confirma <strong>"Instalar"</strong>. Se creará el acceso directo con icono oficial como cualquier APK de Android.
                    </span>
                  </div>
                </div>
              </div>

              {isIOS && (
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" /> En iPhone / Safari:
                  </span>
                  <p>
                    Toca el botón <strong>Compartir</strong> en la barra inferior de Safari y luego selecciona <strong>"Agregar a pantalla de inicio"</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 text-[11px] text-slate-500 space-y-1">
            <p>✓ No consume espacio innecesario en la memoria del teléfono.</p>
            <p>✓ Funciona sin internet para redactar y copiar los reportes.</p>
            <p>✓ Se abre a pantalla completa como una aplicación instalada.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
