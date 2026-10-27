import React, { useState } from 'react';
import { Technician } from '../types.ts';
import { X, Users, Plus, Trash2, RotateCcw } from 'lucide-react';
import { DEFAULT_TECHNICIANS } from '../data/defaults.ts';

interface TechniciansModalProps {
  technicians: Technician[];
  onSave: (list: Technician[]) => void;
  onClose: () => void;
}

export const TechniciansModal: React.FC<TechniciansModalProps> = ({
  technicians,
  onSave,
  onClose,
}) => {
  const [list, setList] = useState<Technician[]>(technicians);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Técnico III');

  const commonRoles = [
    'Técnico III',
    'Técnico II',
    'Técnico I',
    'PASANTE',
    'Analista de Sistemas',
    'Coordinador de Informática',
    'Especialista de Redes',
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newTech: Technician = {
      id: `tech-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
    };

    const updated = [...list, newTech];
    setList(updated);
    onSave(updated);
    setNewName('');
  };

  const handleRemove = (id: string) => {
    const updated = list.filter((t) => t.id !== id);
    setList(updated);
    onSave(updated);
  };

  const handleResetDefaults = () => {
    if (confirm('¿Restablecer el equipo técnico predeterminado de Aragua?')) {
      setList(DEFAULT_TECHNICIANS);
      onSave(DEFAULT_TECHNICIANS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Equipo Técnico y Pasantes</h3>
              <p className="text-xs text-slate-400">
                Administra los técnicos para seleccionarlos con un solo clic en los reportes.
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

        {/* Add new technician form */}
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
          <label className="block text-xs font-bold text-slate-700">Agregar Nuevo Integrante:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre y Apellido (ej: Julio Pérez)"
              className="text-xs text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex gap-1.5">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="text-xs text-slate-800 bg-white border border-slate-300 rounded-lg px-2 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {commonRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </form>

        {/* List of current technicians */}
        <div className="p-4 max-h-[350px] overflow-y-auto space-y-2">
          {list.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 block">{tech.name}</span>
                <span className="text-[11px] text-indigo-700 bg-indigo-50 font-semibold px-2 py-0.5 rounded border border-indigo-200 inline-block mt-0.5">
                  {tech.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(tech.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                title="Eliminar de la lista"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer predeterminados</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
};
