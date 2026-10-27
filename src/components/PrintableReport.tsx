import React from 'react';
import { ReportData } from '../types.ts';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface PrintableReportProps {
  report: ReportData;
  onClose: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ report, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-300 print:border-none print:shadow-none print:w-full print:max-w-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-3 bg-slate-800 text-white flex items-center justify-between rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-semibold">Vista Previa de Ficha Técnica / Minuta Oficial</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 font-serif text-slate-900 space-y-6 print:p-4 print:text-black">
          
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-800">
              REPÚBLICA BOLIVARIANA DE VENEZUELA
            </div>
            <div className="font-bold text-sm uppercase tracking-wide text-slate-900 mt-0.5">
              {report.institution || 'DIRECCIÓN REGIONAL DEL ESTADO BOLIVARIANO ARAGUA'}
            </div>
            <div className="text-xs italic text-slate-700 mt-0.5">
              COORDINACIÓN DE INFORMÁTICA, TELEMÁTICA Y SISTEMAS
            </div>
            <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-blue-900 bg-blue-50 inline-block px-3 py-0.5 mt-2 rounded border border-blue-200 print:border-black">
              ORDEN DE SERVICIO TÉCNICO Y ACTA DE CONFORMIDAD
            </div>
            {report.ticketNumber && (
              <div className="text-xs font-sans font-bold text-slate-700 mt-1">
                N° Control: {report.ticketNumber}
              </div>
            )}
          </div>

          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans bg-slate-50 p-3 rounded-lg border border-slate-200 print:bg-transparent print:border-black">
            <div>
              <span className="font-bold block text-slate-600 uppercase text-[10px]">Fecha:</span>
              <span className="font-semibold">{report.date}</span>
            </div>
            <div>
              <span className="font-bold block text-slate-600 uppercase text-[10px]">Hora / Duración:</span>
              <span className="font-semibold">{report.timeRange || 'No especificada'}</span>
            </div>
            <div>
              <span className="font-bold block text-slate-600 uppercase text-[10px]">Estado:</span>
              <span className="font-bold text-emerald-800 print:text-black">✓ {report.status}</span>
            </div>
            <div>
              <span className="font-bold block text-slate-600 uppercase text-[10px]">Sede:</span>
              <span className="font-medium text-[11px] truncate block" title={report.sede}>{report.sede}</span>
            </div>
          </div>

          {/* Form Content 9 Points */}
          <div className="space-y-4 text-xs font-sans">
            
            {/* 1. Nombre de la Actividad */}
            <div className="border border-slate-300 rounded-lg p-3 print:border-black">
              <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-1">
                1.- Nombre De la Actividad:
              </div>
              <div className="font-bold text-sm text-slate-900">
                {report.activityName}
              </div>
            </div>

            {/* 2. Objetivo O Finalidad */}
            <div className="border border-slate-300 rounded-lg p-3 print:border-black">
              <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-1">
                2.- Objetivo O Finalidad (Diagnóstico y Procedimiento Técnico):
              </div>
              <div className="text-justify text-xs leading-relaxed text-slate-800 font-serif">
                {report.objective}
              </div>
            </div>

            {/* Row for Location & Beneficiaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-300 rounded-lg p-3 print:border-black">
                <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-1">
                  4.- Ubicación Específica / Puesto:
                </div>
                <div className="font-medium text-slate-900">
                  {report.locationArea}
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-3 print:border-black">
                <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-1">
                  6.- Cantidad De Población Beneficiada:
                </div>
                <div className="font-medium text-slate-900">
                  {report.beneficiaries}
                </div>
              </div>
            </div>

            {/* 7. Observaciones y Personal */}
            <div className="border border-slate-300 rounded-lg p-3 print:border-black">
              <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-1">
                7.- Observaciones Generales y Equipo de Informática:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-800 font-medium">
                {(report.technicians || []).map((tech, i) => (
                  <li key={i}>{tech}</li>
                ))}
              </ul>

              {report.additionalObservations && (
                <div className="mt-2 text-xs italic text-slate-600">
                  Nota: {report.additionalObservations}
                </div>
              )}

              {report.materialsUsed && report.materialsUsed.length > 0 && (
                <div className="mt-2 text-[11px] text-slate-700">
                  <span className="font-bold">Materiales / Repuestos instalados: </span>
                  {report.materialsUsed.join(', ')}
                </div>
              )}
            </div>

            {/* Sede completa */}
            <div className="border border-slate-300 rounded-lg p-3 print:border-black">
              <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-1">
                9.- Sede Judicial / Administrativa:
              </div>
              <div className="text-xs text-slate-800">
                {report.sede}
              </div>
            </div>

            {/* Fotos de Evidencia si existen */}
            {report.photos && report.photos.length > 0 && (
              <div className="border border-slate-300 rounded-lg p-3 print:border-black print:page-break-inside-avoid">
                <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide mb-2">
                  Registro Fotográfico de Evidencia Técnica:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {report.photos.map((p, idx) => (
                    <div key={idx} className="border border-slate-200 rounded aspect-video overflow-hidden">
                      <img src={p} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Signatures Area (Dual Box) */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center font-sans text-xs print:pt-12 print:page-break-inside-avoid">
            
            {/* Técnico */}
            <div className="border-t-2 border-slate-800 pt-2">
              <div className="font-bold text-slate-900">TÉCNICO / ESPECIALISTA INTERVINIENTE</div>
              <div className="text-[11px] text-slate-600 mt-1">
                {report.technicians && report.technicians.length > 0 ? report.technicians[0] : 'Equipo de Informática'}
              </div>
              <div className="text-[10px] text-slate-500 mt-3">Firma y Cédula de Identidad</div>
            </div>

            {/* Funcionario receptor */}
            <div className="border-t-2 border-slate-800 pt-2">
              <div className="font-bold text-slate-900">CONFORMIDAD DEL SERVICIO</div>
              <div className="text-[11px] text-slate-600 mt-1">
                {report.applicantName ? `Funcionario: ${report.applicantName}` : 'Funcionario Solicitante / Titular del Puesto'}
              </div>
              <div className="text-[10px] text-slate-500 mt-3">Firma, Cédula y Sello de la Dependencia</div>
            </div>

          </div>

          <div className="text-[9px] text-center text-slate-400 font-sans print:text-slate-600 pt-4">
            Documento generado a través de FormatoFácil Aragua • Dirección Regional del Estado Bolivariano Aragua
          </div>

        </div>

      </div>

    </div>
  );
};
