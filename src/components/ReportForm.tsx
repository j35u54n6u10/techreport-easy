import React, { useState } from 'react';
import { 
  ReportData, 
  Technician, 
  ReportStatus 
} from '../types.ts';
import { 
  DEFAULT_AREAS, 
  DEFAULT_SEDES, 
  DEFAULT_INSTITUTION 
} from '../data/defaults.ts';
import { 
  getTodayFormatted, 
  getYesterdayFormatted, 
  getCurrentTimeFormatted 
} from '../utils/formatter.ts';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Wrench, 
  Plus, 
  Trash2, 
  Camera, 
  ChevronDown, 
  ChevronUp,
  UserCheck,
  FileCheck
} from 'lucide-react';

interface ReportFormProps {
  report: ReportData;
  onChange: (updated: ReportData) => void;
  availableTechnicians: Technician[];
  onOpenManageTechnicians: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  report,
  onChange,
  availableTechnicians,
  onOpenManageTechnicians,
}) => {
  const [isImprovingText, setIsImprovingText] = useState(false);
  const [improveError, setImproveError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customMaterial, setCustomMaterial] = useState('');

  const updateField = <K extends keyof ReportData>(field: K, value: ReportData[K]) => {
    onChange({
      ...report,
      [field]: value,
      updatedAt: Date.now(),
    });
  };

  // Toggle technician in the report
  const toggleTechnician = (techString: string) => {
    const current = report.technicians || [];
    const exists = current.some((t) => t.toLowerCase() === techString.toLowerCase());
    if (exists) {
      updateField('technicians', current.filter((t) => t.toLowerCase() !== techString.toLowerCase()));
    } else {
      updateField('technicians', [...current, techString]);
    }
  };

  // AI improve objective
  const handleImproveObjective = async () => {
    if (!report.objective.trim()) return;
    setIsImprovingText(true);
    setImproveError(null);

    try {
      const res = await fetch('/api/ai/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: report.objective,
          activityName: report.activityName,
          locationArea: report.locationArea,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo mejorar la redacción');
      }

      const data = await res.json();
      if (data.success && data.improvedText) {
        updateField('objective', data.improvedText);
      }
    } catch (err: any) {
      setImproveError(err.message || 'Error al conectar con la IA de redacción.');
    } finally {
      setIsImprovingText(false);
    }
  };

  // Add material to list
  const addMaterial = (name: string) => {
    if (!name.trim()) return;
    const current = report.materialsUsed || [];
    if (!current.includes(name.trim())) {
      updateField('materialsUsed', [...current, name.trim()]);
    }
    setCustomMaterial('');
  };

  const removeMaterial = (name: string) => {
    updateField('materialsUsed', (report.materialsUsed || []).filter(m => m !== name));
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          updateField('photos', [...(report.photos || []), base64]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const updated = [...(report.photos || [])];
    updated.splice(index, 1);
    updateField('photos', updated);
  };

  return (
    <div className="space-y-5">

      {/* Header Institucional (Editable si cambia) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Encabezado Institucional
        </label>
        <input
          type="text"
          value={report.institution}
          onChange={(e) => updateField('institution', e.target.value)}
          className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
          placeholder="DIRECCIÓN REGIONAL DEL ESTADO BOLIVARIANO ARAGUA"
        />
      </div>

      {/* 📌 1.- Nombre De la Actividad */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="text-blue-600 font-extrabold">📌 1.-</span> Nombre De la Actividad
          </label>
          <span className="text-[11px] text-slate-400">Título técnico principal</span>
        </div>
        <textarea
          rows={2}
          value={report.activityName}
          onChange={(e) => updateField('activityName', e.target.value)}
          placeholder="Ej: Mantenimiento Correctivo, Reemplazo de Jack Modular RJ45 y Restablecimiento de Conectividad en Red Local"
          className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
        />
      </div>

      {/* 📌 2.- Objetivo O Finalidad */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="text-blue-600 font-extrabold">📌 2.-</span> Objetivo O Finalidad
          </label>
          
          <button
            type="button"
            onClick={handleImproveObjective}
            disabled={isImprovingText || !report.objective.trim()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all active:scale-95"
            title="Convierte notas informales en redacción técnica institucional pulida"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isImprovingText ? 'Perfeccionando...' : 'Mejorar Redacción (IA)'}</span>
          </button>
        </div>

        <textarea
          rows={5}
          value={report.objective}
          onChange={(e) => updateField('objective', e.target.value)}
          placeholder="Describe la falla encontrada, el diagnóstico, los procedimientos técnicos ejecutados y el resultado final..."
          className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
        />

        {improveError && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {improveError}
          </p>
        )}
      </div>

      {/* Row for Fecha y Hora */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* 📌 3.- Fecha */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-blue-600 font-extrabold">📌 3.-</span> Fecha
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateField('date', getTodayFormatted())}
                className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => updateField('date', getYesterdayFormatted())}
                className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Ayer
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              value={report.date}
              onChange={(e) => updateField('date', e.target.value)}
              placeholder="DD/MM/AAAA (ej: 23/10/2026)"
              className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 📌 5.- Hora */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-blue-600 font-extrabold">📌 5.-</span> Hora
            </label>
            <button
              type="button"
              onClick={() => updateField('timeRange', getCurrentTimeFormatted())}
              className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Hora actual
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={report.timeRange}
              onChange={(e) => updateField('timeRange', e.target.value)}
              placeholder="Ej: desde las 11:30am o de 09:00am a 11:00am"
              className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

      </div>

      {/* 📌 4.- Ubicación */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
          <span className="text-blue-600 font-extrabold">📌 4.-</span> Ubicación (Área / Puesto)
        </label>
        <div className="relative mb-2.5">
          <input
            type="text"
            value={report.locationArea}
            onChange={(e) => updateField('locationArea', e.target.value)}
            placeholder="Ej: Circuito Judicial Agrario (Puesto de trabajo de Ana Paula)"
            className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Áreas habituales:</span>
          {DEFAULT_AREAS.slice(0, 6).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => updateField('locationArea', area)}
              className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-colors"
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* 📌 6.- Cantidad De Población Beneficiada */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
          <span className="text-blue-600 font-extrabold">📌 6.-</span> Cantidad De Población Beneficiada
        </label>
        <div className="relative mb-2">
          <input
            type="text"
            value={report.beneficiaries}
            onChange={(e) => updateField('beneficiaries', e.target.value)}
            placeholder="Ej: Funcionaria Ana Paula y personal adscrito al Circuito Judicial Agrario"
            className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Sugerencias:</span>
          {[
            'Personal adscrito al área y usuarios del tribunal',
            'Funcionarios de secretaría y público en general',
            'Equipo multidisciplinario y coordinaciones',
          ].map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => updateField('beneficiaries', sug)}
              className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* 📌 7.- Observaciones Generales y Técnicos Participantes */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-blue-600 font-extrabold">📌 7.-</span> Equipo Técnico & Observaciones
            </label>
            <p className="text-xs text-slate-500">
              Marca con 1 clic los técnicos que participaron en esta actividad:
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenManageTechnicians}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            Editar personal
          </button>
        </div>

        {/* Technician Chips Toggles */}
        <div className="flex flex-wrap gap-2 mb-3 pt-1">
          {availableTechnicians.map((tech) => {
            const formatted = `${tech.name} ${tech.role}`.trim();
            const isSelected = (report.technicians || []).some(
              (t) => t.toLowerCase() === formatted.toLowerCase() || t.toLowerCase().includes(tech.name.toLowerCase())
            );

            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggleTechnician(formatted)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-semibold ring-2 ring-blue-400 ring-offset-1'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{tech.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'}`}>
                  {tech.role}
                </span>
              </button>
            );
          })}
        </div>

        {/* Additional Observations field */}
        <div className="mt-3">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Notas adicionales o insumos:
          </label>
          <input
            type="text"
            value={report.additionalObservations}
            onChange={(e) => updateField('additionalObservations', e.target.value)}
            placeholder="Ej: Actividad realizada por el equipo de informática. Equipo probado en dominio."
            className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 📌 8.- Actividad en proceso o culminada */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
          <span className="text-blue-600 font-extrabold">📌 8.-</span> Estado de la Actividad
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { value: 'CULMINADA', label: '✓ CULMINADA', desc: 'Trabajo terminado y operativo', color: 'emerald' },
            { value: 'EN PROCESO', label: '⏳ EN PROCESO', desc: 'En ejecución técnica', color: 'amber' },
            { value: 'PENDIENTE POR REPUESTO', label: '⚠️ PENDIENTE REPUESTO', desc: 'En espera de insumo', color: 'orange' },
          ].map((item) => {
            const isSelected = report.status === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateField('status', item.value as ReportStatus)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? item.color === 'emerald'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/30'
                      : item.color === 'amber'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/30'
                      : 'bg-orange-50 border-orange-500 text-orange-900 ring-2 ring-orange-500/30'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📌 9.- Sede */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
          <span className="text-blue-600 font-extrabold">📌 9.-</span> Sede
        </label>
        <div className="relative mb-2">
          <input
            type="text"
            value={report.sede}
            onChange={(e) => updateField('sede', e.target.value)}
            placeholder="Circuito de Protección Maracay estado Aragua, edif Raila 2 c/c Paez y Sucre"
            className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Sedes Habituales */}
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[11px] font-medium text-slate-400">Sedes frecuentes:</span>
          {DEFAULT_SEDES.map((sedeOption) => (
            <button
              key={sedeOption}
              type="button"
              onClick={() => updateField('sede', sedeOption)}
              className={`text-left px-2.5 py-1 rounded text-xs transition-colors ${
                report.sede === sedeOption
                  ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              • {sedeOption}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced / Printable details accordion */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Datos para Ficha Técnica / Minuta de Trabajo Impresa (Opcional)</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showAdvanced && (
          <div className="p-4 border-t border-slate-200 space-y-4 bg-white">
            
            {/* Funcionario Solicitante y Ticket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Funcionario Solicitante / Receptor:
                </label>
                <input
                  type="text"
                  value={report.applicantName || ''}
                  onChange={(e) => updateField('applicantName', e.target.value)}
                  placeholder="Ej: Ana Paula"
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  N° de Ticket / Oficio / Requerimiento:
                </label>
                <input
                  type="text"
                  value={report.ticketNumber || ''}
                  onChange={(e) => updateField('ticketNumber', e.target.value)}
                  placeholder="Ej: INF-2026-104"
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Materiales utilizados */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Materiales e Insumos instalados:
              </label>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMaterial(customMaterial);
                    }
                  }}
                  placeholder="Ej: 1x Jack RJ45 Cat6, 1x Patch cord 1.5m..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1.5"
                />
                <button
                  type="button"
                  onClick={() => addMaterial(customMaterial)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Agregar
                </button>
              </div>

              {report.materialsUsed && report.materialsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {report.materialsUsed.map((mat) => (
                    <span
                      key={mat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      <Wrench className="w-3 h-3 text-slate-500" />
                      <span>{mat}</span>
                      <button
                        type="button"
                        onClick={() => removeMaterial(mat)}
                        className="text-slate-400 hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Fotos de Evidencia */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Fotos de Evidencia Técnica (Antes / Después):</span>
                </label>
                <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700">
                  <span>+ Adjuntar Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {report.photos && report.photos.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {report.photos.map((photo, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                      <img src={photo} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">No hay fotos adjuntas.</p>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
