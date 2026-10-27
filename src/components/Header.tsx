import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  History, 
  Users, 
  Layers, 
  PlusCircle, 
  ClipboardPaste,
  ShieldCheck,
  Smartphone,
  Menu,
  X,
  Zap,
  Printer,
  ChevronRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onNewReport: () => void;
  onOpenTemplates: () => void;
  onOpenTechnicians: () => void;
  onOpenHistory: () => void;
  onOpenImport: () => void;
  onOpenInstall: () => void;
  onOpenPrint?: () => void;
  onSelectMode?: (mode: 'fast' | 'full') => void;
  currentMode?: 'fast' | 'full';
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewReport,
  onOpenTemplates,
  onOpenTechnicians,
  onOpenHistory,
  onOpenImport,
  onOpenInstall,
  onOpenPrint,
  onSelectMode,
  currentMode = 'fast',
  savedCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo & Institutional Title */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-blue-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight truncate">
                    FormatoFácil Aragua
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800 shrink-0">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" /> Informática
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                  Dirección Regional del Estado Bolivariano Aragua
                </p>
              </div>
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Quick '+ Nuevo' Button */}
              <button
                type="button"
                onClick={onNewReport}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm active:scale-95"
                title="Iniciar nuevo reporte en blanco"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Nuevo</span>
              </button>

              {/* Desktop Direct Quick Links (hidden on mobile, in drawer on all) */}
              <div className="hidden lg:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenTemplates}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  title="Plantillas técnicas frecuentes"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Plantillas</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors relative"
                  title="Ver reportes guardados"
                >
                  <History className="w-3.5 h-3.5 text-purple-400" />
                  <span>Historial</span>
                  {savedCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-900 text-purple-200 border border-purple-700">
                      {savedCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onOpenInstall}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all border border-emerald-500"
                  title="Instalar en teléfono como APK"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>APK</span>
                </button>
              </div>

              {/* HAMBURGER BUTTON (La Hamburguesa Estilizada) */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center relative ${
                  isOpen
                    ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                aria-label="Abrir menú de opciones"
                title="Menú de opciones y herramientas"
              >
                {isOpen ? (
                  <X className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Menu className="w-5 h-5 stroke-[2.2]" />
                )}

                {/* Notification dot if there are saved reports */}
                {!isOpen && savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                )}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* FLYOUT DRAWER MENU (Menú Desplegable Lateral Estilizado) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[300px] sm:w-[350px] bg-slate-900 text-white shadow-2xl border-l border-slate-800 flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                Menú de Herramientas
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                Soporte & Informática Aragua
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items Container */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs font-sans">
          
          {/* Section 1: Modos de Trabajo */}
          {onSelectMode && (
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Modo de Visualización
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleAction(() => onSelectMode('fast'))}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    currentMode === 'fast'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modo Rápido</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction(() => onSelectMode('full'))}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    currentMode === 'full'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>9 Puntos</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Herramientas Principales */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Acciones y Plantillas
            </div>
            
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleAction(onNewReport)}
                className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-blue-300">Nuevo Reporte en Blanco</div>
                    <div className="text-[10px] text-slate-400">Limpiar y comenzar otra actividad</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleAction(onOpenTemplates)}
                className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-amber-300">Catálogo de Plantillas</div>
                    <div className="text-[10px] text-slate-400">RJ45, preventivo, impresoras, claves...</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleAction(onOpenImport)}
                className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ClipboardPaste className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-emerald-300">Importar Mensaje de WhatsApp</div>
                    <div className="text-[10px] text-slate-400">Pegar reporte previo y autocompletar</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Section 3: Gestión y Archivo */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Equipo y Archivo Local
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleAction(onOpenTechnicians)}
                className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-indigo-300">Equipo Técnico y Pasantes</div>
                    <div className="text-[10px] text-slate-400">Anyelina, Andrea, Derixon, Julio, Jesús...</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleAction(onOpenHistory)}
                className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-purple-300 flex items-center gap-1.5">
                      <span>Historial Guardado</span>
                      {savedCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-900 text-purple-200">
                          {savedCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">Ver y duplicar reportes guardados</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>

              {onOpenPrint && (
                <button
                  type="button"
                  onClick={() => handleAction(onOpenPrint)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-left group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 group-hover:text-blue-300">Ficha Técnica Oficial (PDF)</div>
                      <div className="text-[10px] text-slate-400">Para imprimir y firmar conformidad</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Móvil / APK Banner */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleAction(onOpenInstall)}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-between shadow-lg shadow-emerald-950/40 border border-emerald-500/50 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-100" />
                <div className="text-left">
                  <div className="text-xs font-black">Instalar como APK</div>
                  <div className="text-[10px] text-emerald-100 font-normal">Acceso directo en pantalla de inicio</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-200" />
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Almacenamiento local activo</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v2.1 Aragua</span>
        </div>
      </aside>
    </>
  );
};
