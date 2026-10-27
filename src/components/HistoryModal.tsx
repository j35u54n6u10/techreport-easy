import React, { useState } from 'react';
import { ReportData } from '../types.ts';
import { 
  X, 
  History, 
  Search, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Download, 
  Calendar, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { getTodayFormatted } from '../utils/formatter.ts';

interface HistoryModalProps {
  reports: ReportData[];
  onLoadReport: (report: ReportData) => void;
  onDuplicateReport: (report: ReportData) => void;
  onDeleteReport: (id: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  reports,
  onLoadReport,
  onDuplicateReport,
  onDeleteReport,
  onClearHistory,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = reports.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (r.activityName || '').toLowerCase().includes(search) ||
      (r.locationArea || '').toLowerCase().includes(search) ||
      (r.objective || '').toLowerCase().includes(search) ||
      (r.date || '').includes(search) ||
      (r.technicians || []).some((t) => t.toLowerCase().includes(search));
    return matchesStatus && matchesSearch;
  });

  const exportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `Reportes_Aragua_Backup_${getTodayFormatted().replace(/\//g, '-')}.json`);
    dlAnchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Historial de Reportes Guardados</h3>
              <p className="text-xs text-slate-400">
                {reports.length} reportes archivados localmente en este dispositivo.
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

        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por actividad, fecha, técnico..."
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700"
            >
              <option value="all">Todos los estados</option>
              <option value="CULMINADA">CULMINADA</option>
              <option value="EN PROCESO">EN PROCESO</option>
              <option value="PENDIENTE POR REPUESTO">PENDIENTE</option>
            </select>

            {reports.length > 0 && (
              <button
                type="button"
                onClick={exportAllJson}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700"
                title="Descargar copia de seguridad en JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Respaldar</span>
              </button>
            )}
          </div>
        </div>

        {/* Reports list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No hay reportes guardados que coincidan.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 hover:border-purple-300 rounded-xl p-3.5 bg-white hover:bg-purple-50/20 transition-all shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {item.date}
                      </span>

                      {item.timeRange && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.timeRange}
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'CULMINADA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'EN PROCESO'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        ✓ {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 pt-0.5">
                      {item.activityName || 'Sin título'}
                    </h4>

                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.locationArea || 'Área no especificada'}</span>
                    </div>

                    {item.technicians && item.technicians.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold">Técnicos: </span>
                        {item.technicians.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Actions for this item */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onLoadReport(item)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      title="Editar y cargar este reporte"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Cargar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateReport(item)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                      title="Duplicar como nuevo reporte con la fecha de hoy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteReport(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar del historial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {reports.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Estás seguro de vaciar todo el historial de reportes?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold"
            >
              Vaciar historial
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg ml-auto"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
