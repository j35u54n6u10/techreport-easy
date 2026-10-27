import React from 'react';
import { Zap, FileText, Smartphone, History, Layers } from 'lucide-react';

export type MobileTab = 'fast' | 'full' | 'whatsapp' | 'history';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  savedCount: number;
  onOpenTemplates: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenTemplates,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 select-none md:hidden safe-bottom shadow-2xl">
      <div className="grid grid-cols-4 h-15">
        
        {/* Tab 1: Modo Rápido */}
        <button
          type="button"
          onClick={() => onSelectTab('fast')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            currentTab === 'fast'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'fast' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>
            <Zap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] tracking-tight">Rápido</span>
        </button>

        {/* Tab 2: 9 Puntos Detallado */}
        <button
          type="button"
          onClick={() => onSelectTab('full')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            currentTab === 'full'
              ? 'text-blue-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'full' ? 'bg-blue-500/20 text-blue-400' : ''}`}>
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] tracking-tight">9 Puntos</span>
        </button>

        {/* Tab 3: WhatsApp Preview */}
        <button
          type="button"
          onClick={() => onSelectTab('whatsapp')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 relative ${
            currentTab === 'whatsapp'
              ? 'text-[#25D366] font-extrabold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'whatsapp' ? 'bg-emerald-500/20 text-[#25D366]' : ''}`}>
            <Smartphone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] tracking-tight">WhatsApp</span>
        </button>

        {/* Tab 4: Historial */}
        <button
          type="button"
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 relative ${
            currentTab === 'history'
              ? 'text-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'history' ? 'bg-purple-500/20 text-purple-400' : ''}`}>
            <History className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] tracking-tight">Historial</span>
          {savedCount > 0 && (
            <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {savedCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  );
};
