import React, { useState, useEffect } from 'react';
import { 
  ReportData, 
  Technician, 
  TemplateActivity 
} from './types.ts';
import { 
  INITIAL_REPORT, 
  DEFAULT_TECHNICIANS, 
  DEFAULT_INSTITUTION, 
  DEFAULT_SEDES,
  DEFAULT_TEMPLATES
} from './data/defaults.ts';
import { 
  getTodayFormatted, 
  getCurrentTimeFormatted 
} from './utils/formatter.ts';

import { Header } from './components/Header.tsx';
import { FastFillMode } from './components/FastFillMode.tsx';
import { QuickFillBar } from './components/QuickFillBar.tsx';
import { ReportForm } from './components/ReportForm.tsx';
import { WhatsAppPreview } from './components/WhatsAppPreview.tsx';
import { PrintableReport } from './components/PrintableReport.tsx';
import { TemplatesModal } from './components/TemplatesModal.tsx';
import { TechniciansModal } from './components/TechniciansModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { ImportWhatsAppModal } from './components/ImportWhatsAppModal.tsx';
import { InstallModal } from './components/InstallModal.tsx';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav.tsx';
import { 
  FileEdit, 
  Smartphone, 
  Check, 
  Zap, 
  Download,
  RotateCcw,
  Heart
} from 'lucide-react';

const STORAGE_KEYS = {
  CURRENT_REPORT: 'formatofacil_current_report',
  SAVED_REPORTS: 'formatofacil_saved_reports',
  TECHNICIANS: 'formatofacil_technicians',
};

export default function App() {
  // Load technicians from localStorage or default
  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_TECHNICIANS;
  });

  // Load saved reports history
  const [savedReports, setSavedReports] = useState<ReportData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_REPORTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [INITIAL_REPORT];
  });

  // Load current working report
  const [report, setReport] = useState<ReportData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_REPORT);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_REPORT;
  });

  // Mobile active tab ('fast' | 'full' | 'whatsapp' | 'history')
  const [mobileTab, setMobileTab] = useState<MobileTab>('fast');

  // Desktop editor mode ('fast' | 'full')
  const [desktopEditorMode, setDesktopEditorMode] = useState<'fast' | 'full'>('fast');

  const [activeModal, setActiveModal] = useState<
    null | 'templates' | 'technicians' | 'history' | 'import' | 'print' | 'install'
  >(null);

  const [saveToast, setSaveToast] = useState(false);

  // Auto-persist current working report to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_REPORT, JSON.stringify(report));
    } catch (e) {}
  }, [report]);

  // Persist technicians
  const handleSaveTechnicians = (newList: Technician[]) => {
    setTechnicians(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(newList));
    } catch (e) {}
  };

  // Persist saved reports history
  const persistSavedReports = (list: ReportData[]) => {
    setSavedReports(list);
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_REPORTS, JSON.stringify(list));
    } catch (e) {}
  };

  // Create clean blank report
  const handleNewReport = () => {
    const newRep: ReportData = {
      id: `rep-${Date.now()}`,
      institution: report.institution || DEFAULT_INSTITUTION,
      activityName: '',
      objective: '',
      date: getTodayFormatted(),
      locationArea: 'Circuito Judicial Agrario',
      timeRange: getCurrentTimeFormatted(),
      beneficiaries: 'Funcionarios y personal adscrito al área',
      technicians: technicians.slice(0, 2).map((t) => `${t.name} ${t.role}`),
      additionalObservations: 'Actividad realizada por el equipo de informática.',
      status: 'CULMINADA',
      sede: DEFAULT_SEDES[0],
      materialsUsed: [],
      photos: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setReport(newRep);
    setMobileTab('fast');
  };

  // Apply AI parsed data
  const handleAiFill = (parsed: Partial<ReportData>) => {
    setReport((prev) => ({
      ...prev,
      ...parsed,
      technicians: parsed.technicians && parsed.technicians.length > 0 ? parsed.technicians : prev.technicians,
      updatedAt: Date.now(),
    }));
  };

  // Apply template
  const handleApplyTemplate = (template: TemplateActivity | string) => {
    let tpl: TemplateActivity | undefined;
    if (typeof template === 'string') {
      tpl = DEFAULT_TEMPLATES.find((x) => x.id === template);
    } else {
      tpl = template;
    }

    if (!tpl) return;

    setReport((prev) => ({
      ...prev,
      activityName: tpl.title,
      objective: tpl.defaultObjective,
      locationArea: prev.locationArea || tpl.defaultLocation,
      beneficiaries: prev.beneficiaries || tpl.defaultBeneficiaries,
      materialsUsed: tpl.suggestedMaterials || prev.materialsUsed,
      updatedAt: Date.now(),
    }));

    if (activeModal === 'templates') {
      setActiveModal(null);
    }
  };

  // Save current report to History
  const handleSaveReport = () => {
    const existingIndex = savedReports.findIndex((r) => r.id === report.id);
    let updated: ReportData[];

    if (existingIndex >= 0) {
      updated = [...savedReports];
      updated[existingIndex] = { ...report, updatedAt: Date.now() };
    } else {
      updated = [{ ...report, id: `rep-${Date.now()}`, updatedAt: Date.now() }, ...savedReports];
    }

    persistSavedReports(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Load a report from history into current editor
  const handleLoadReport = (rep: ReportData) => {
    setReport(rep);
    setActiveModal(null);
    setMobileTab('fast');
  };

  // Duplicate a report for today
  const handleDuplicateReport = (rep: ReportData) => {
    const duplicated: ReportData = {
      ...rep,
      id: `rep-${Date.now()}`,
      date: getTodayFormatted(),
      timeRange: getCurrentTimeFormatted(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setReport(duplicated);
    setActiveModal(null);
    setMobileTab('fast');
  };

  // Delete from history
  const handleDeleteReport = (id: string) => {
    const filtered = savedReports.filter((r) => r.id !== id);
    persistSavedReports(filtered);
  };

  // Clear all history
  const handleClearHistory = () => {
    persistSavedReports([]);
  };

  // Handle bottom navigation tabs on phones
  const handleBottomTabChange = (tab: MobileTab) => {
    if (tab === 'history') {
      setActiveModal('history');
    } else {
      setMobileTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased select-text">
      
      {/* Top Header / App Bar with Stylized Hamburger Menu */}
      <Header
        onNewReport={handleNewReport}
        onOpenTemplates={() => setActiveModal('templates')}
        onOpenTechnicians={() => setActiveModal('technicians')}
        onOpenHistory={() => setActiveModal('history')}
        onOpenImport={() => setActiveModal('import')}
        onOpenInstall={() => setActiveModal('install')}
        onOpenPrint={() => setActiveModal('print')}
        onSelectMode={(mode) => {
          setDesktopEditorMode(mode);
          setMobileTab(mode);
        }}
        currentMode={desktopEditorMode}
        savedCount={savedReports.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-3 sm:space-y-4">
        
        {/* Mobile Quick Banner for APK */}
        <div className="md:hidden bg-gradient-to-r from-emerald-800 to-slate-900 text-white rounded-xl p-2.5 shadow-sm flex items-center justify-between gap-2 border border-emerald-600/40">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-extrabold text-emerald-300">Modo APK Móvil</span>
              <span className="text-slate-300 block">Agrégala a tu pantalla de inicio.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('install')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black shadow-xs active:scale-95 transition-all"
          >
            Instalar APK
          </button>
        </div>

        {/* Desktop Mode Selector (Modo Rápido vs 9 Puntos) */}
        <div className="hidden md:flex items-center justify-between bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDesktopEditorMode('fast')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all ${
                desktopEditorMode === 'fast'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Modo Rápido (Solo dime qué hiciste)</span>
            </button>

            <button
              type="button"
              onClick={() => setDesktopEditorMode('full')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                desktopEditorMode === 'full'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Formulario Completo (9 Puntos)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewReport}
            className="text-xs text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 pr-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nuevo en blanco</span>
          </button>
        </div>

        {/* Layout: Desktop 2-column grid vs Mobile Tabs */}
        
        {/* DESKTOP VIEW (md and up) */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 items-start">
          <div className="col-span-7 space-y-4">
            {desktopEditorMode === 'fast' ? (
              <FastFillMode
                report={report}
                onChange={setReport}
                availableTechnicians={technicians}
                onOpenAdvanced={() => setDesktopEditorMode('full')}
              />
            ) : (
              <div className="space-y-4">
                <QuickFillBar
                  onAiFill={handleAiFill}
                  onApplyTemplate={(id) => handleApplyTemplate(id)}
                />
                <ReportForm
                  report={report}
                  onChange={setReport}
                  availableTechnicians={technicians}
                  onOpenManageTechnicians={() => setActiveModal('technicians')}
                />
              </div>
            )}
          </div>

          <div className="col-span-5">
            <WhatsAppPreview
              report={report}
              onSave={handleSaveReport}
              onPrint={() => setActiveModal('print')}
              isSaved={saveToast}
            />
          </div>
        </div>

        {/* MOBILE VIEW (Phone optimized screen by active tab) */}
        <div className="md:hidden">
          {mobileTab === 'fast' && (
            <FastFillMode
              report={report}
              onChange={setReport}
              availableTechnicians={technicians}
              onOpenAdvanced={() => setMobileTab('full')}
              onOpenWhatsAppPreview={() => setMobileTab('whatsapp')}
            />
          )}

          {mobileTab === 'full' && (
            <div className="space-y-3 pb-20">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-extrabold text-slate-800">
                  Formulario Oficial de 9 Puntos
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileTab('fast')}
                  className="text-xs font-bold text-emerald-600"
                >
                  ← Modo Rápido
                </button>
              </div>

              <QuickFillBar
                onAiFill={handleAiFill}
                onApplyTemplate={(id) => handleApplyTemplate(id)}
              />

              <ReportForm
                report={report}
                onChange={setReport}
                availableTechnicians={technicians}
                onOpenManageTechnicians={() => setActiveModal('technicians')}
              />
            </div>
          )}

          {mobileTab === 'whatsapp' && (
            <div className="space-y-3 pb-20">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-extrabold text-slate-800">
                  Vista Previa para WhatsApp
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileTab('fast')}
                  className="text-xs font-bold text-emerald-600"
                >
                  ← Volver a Editar
                </button>
              </div>

              <WhatsAppPreview
                report={report}
                onSave={handleSaveReport}
                onPrint={() => setActiveModal('print')}
                isSaved={saveToast}
              />
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-8 pb-24 md:pb-8 text-center text-xs text-slate-500 font-medium">
        <p className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xs border border-slate-200/60 shadow-xs">
          <span>Elaborado con amor para Julio</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
        </p>
      </footer>

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed bottom-20 md:bottom-5 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡Reporte guardado en tu teléfono!</span>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Fixed for APK feel) */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={handleBottomTabChange}
        savedCount={savedReports.length}
        onOpenTemplates={() => setActiveModal('templates')}
      />

      {/* Modals */}
      {activeModal === 'install' && (
        <InstallModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'templates' && (
        <TemplatesModal
          onSelectTemplate={handleApplyTemplate}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'technicians' && (
        <TechniciansModal
          technicians={technicians}
          onSave={handleSaveTechnicians}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'history' && (
        <HistoryModal
          reports={savedReports}
          onLoadReport={handleLoadReport}
          onDuplicateReport={handleDuplicateReport}
          onDeleteReport={handleDeleteReport}
          onClearHistory={handleClearHistory}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'import' && (
        <ImportWhatsAppModal
          onImport={(parsed) => {
            setReport((prev) => ({
              ...prev,
              ...parsed,
              updatedAt: Date.now(),
            }));
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'print' && (
        <PrintableReport
          report={report}
          onClose={() => setActiveModal(null)}
        />
      )}

    </div>
  );
}
