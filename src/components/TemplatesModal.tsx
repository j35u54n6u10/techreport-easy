import React, { useState } from 'react';
import { DEFAULT_TEMPLATES } from '../data/defaults.ts';
import { TemplateActivity } from '../types.ts';
import { X, Layers, Check, Wrench, Search, ChevronRight } from 'lucide-react';

interface TemplatesModalProps {
  onSelectTemplate: (template: TemplateActivity) => void;
  onClose: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  onSelectTemplate,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas las plantillas' },
    { id: 'redes', label: 'Redes y Cableado' },
    { id: 'hardware', label: 'Hardware y PC' },
    { id: 'impresoras', label: 'Impresoras' },
    { id: 'software', label: 'Software y SO' },
    { id: 'seguridad', label: 'Cuentas y Claves' },
  ];

  const filtered = DEFAULT_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.defaultObjective.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Plantillas de Actividades Técnicas</h3>
              <p className="text-xs text-slate-400">
                Selecciona una plantilla para rellenar automáticamente el título y la redacción oficial.
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

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar plantilla (ej: rj45, formateo, preventivo, tóner...)"
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No se encontraron plantillas con ese criterio de búsqueda.
            </div>
          ) : (
            filtered.map((template) => (
              <div
                key={template.id}
                className="border border-slate-200 hover:border-blue-400 rounded-xl p-3.5 transition-all bg-white hover:bg-blue-50/20 group relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {template.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Ubicación sugerida: {template.defaultLocation}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                      {template.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {template.defaultObjective}
                    </p>

                    {template.suggestedMaterials && template.suggestedMaterials.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 flex-wrap">
                        <Wrench className="w-3 h-3 text-slate-400" />
                        <span>Insumos: {template.suggestedMaterials.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTemplate(template)}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs flex items-center gap-1 active:scale-95"
                  >
                    <span>Aplicar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
