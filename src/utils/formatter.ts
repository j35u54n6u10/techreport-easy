import { ReportData } from '../types.ts';

/**
 * Formats a ReportData object into the exact official WhatsApp layout requested by Jesús & Julio
 */
export function formatToWhatsApp(report: ReportData): string {
  const institution = (report.institution || 'DIRECCIÓN REGIONAL DEL ESTADO BOLIVARIANO ARAGUA').trim();
  const activityName = (report.activityName || '').trim();
  const objective = (report.objective || '').trim();
  const date = (report.date || '').trim();
  const locationArea = (report.locationArea || '').trim();
  const timeRange = (report.timeRange || '').trim();
  const beneficiaries = (report.beneficiaries || '').trim();
  const status = (report.status || 'CULMINADA').trim();
  const sede = (report.sede || '').trim();

  // Format technicians list with checkmarks
  const techniciansList = (report.technicians && report.technicians.length > 0)
    ? report.technicians.map(tech => `✓ ${tech.trim()}`).join('\n')
    : '✓ Personal de Informática';

  const observationsHeader = '📌7.- Observaciones Generales: Actividad realizada por el equipo de informática:\n' + techniciansList;
  const extraNotes = report.additionalObservations && report.additionalObservations.trim() && !report.additionalObservations.includes('Actividad realizada por el equipo de informática')
    ? `\n✓ Nota: ${report.additionalObservations.trim()}`
    : '';

  const materials = report.materialsUsed && report.materialsUsed.length > 0
    ? `\n✓ Materiales/Insumos: ${report.materialsUsed.join(', ')}`
    : '';

  return `${institution}

📌1.- Nombre De la Actividad:
✓ ${activityName}

📌2.- Objetivo O Finalidad:
${objective}

📌3.- Fecha: ${date}  

📌4.- Ubicación:
✓ Área: ${locationArea}

📌5.- Hora: ${timeRange}

📌6.- Cantidad De Población Beneficiada:
✓ ${beneficiaries}

${observationsHeader}${extraNotes}${materials}

📌8.- Actividad en proceso o culminada:
✓ ${status}

📌9.- Sede: ${sede}`;
}

/**
 * Parses an existing WhatsApp message back into structured fields
 */
export function parseFromWhatsApp(text: string): Partial<ReportData> {
  const result: Partial<ReportData> = {};
  if (!text || typeof text !== 'string') return result;

  // Institution line (first line before 📌1)
  const headerMatch = text.match(/^([\s\S]*?)📌1/i);
  if (headerMatch && headerMatch[1]) {
    const cleaned = headerMatch[1].replace(/\[.*?\]\s*[^:]+:\s*/g, '').trim();
    if (cleaned.length > 3) {
      result.institution = cleaned;
    }
  }

  // 1. Nombre De la Actividad
  const actMatch = text.match(/📌1[.-]?\s*Nombre\s+De\s+la\s+Actividad:?\s*[\r\n]+(?:✓\s*)?([^\n📌]+)/i);
  if (actMatch && actMatch[1]) {
    result.activityName = actMatch[1].trim();
  }

  // 2. Objetivo O Finalidad
  const objMatch = text.match(/📌2[.-]?\s*Objetivo\s+O\s+Finalidad:?\s*[\r\n]+([\s\S]*?)(?=📌3|$)/i);
  if (objMatch && objMatch[1]) {
    result.objective = objMatch[1].trim();
  }

  // 3. Fecha
  const dateMatch = text.match(/📌3[.-]?\s*Fecha:?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i);
  if (dateMatch && dateMatch[1]) {
    result.date = dateMatch[1].trim();
  }

  // 4. Ubicación
  const locMatch = text.match(/📌4[.-]?\s*Ubicaci[oó]n:?\s*[\r\n]+(?:✓\s*Área:?\s*|✓\s*)?([^\n📌]+)/i);
  if (locMatch && locMatch[1]) {
    result.locationArea = locMatch[1].replace(/^Área:?\s*/i, '').trim();
  }

  // 5. Hora
  const timeMatch = text.match(/📌5[.-]?\s*Hora:?\s*([^\n📌]+)/i);
  if (timeMatch && timeMatch[1]) {
    result.timeRange = timeMatch[1].trim();
  }

  // 6. Cantidad De Población Beneficiada
  const benMatch = text.match(/📌6[.-]?\s*Cantidad\s+De\s+Poblaci[oó]n\s+Beneficiada:?\s*[\r\n]+(?:✓\s*)?([^\n📌]+)/i);
  if (benMatch && benMatch[1]) {
    result.beneficiaries = benMatch[1].trim();
  }

  // 7. Observaciones Generales y Técnicos
  const obsMatch = text.match(/📌7[.-]?\s*Observaciones\s+Generales:?([\s\S]*?)(?=📌8|$)/i);
  if (obsMatch && obsMatch[1]) {
    const lines = obsMatch[1].split('\n').map(l => l.trim()).filter(Boolean);
    const techs: string[] = [];
    const extraNotes: string[] = [];

    for (const line of lines) {
      if (line.includes('Actividad realizada por el equipo de informática')) continue;
      if (line.startsWith('✓')) {
        const item = line.replace(/^✓\s*/, '').trim();
        if (item.toLowerCase().startsWith('nota:')) {
          extraNotes.push(item.replace(/^nota:\s*/i, ''));
        } else if (item.toLowerCase().startsWith('materiales/insumos:')) {
          // materials handled elsewhere
        } else {
          techs.push(item);
        }
      }
    }
    if (techs.length > 0) {
      result.technicians = techs;
    }
    if (extraNotes.length > 0) {
      result.additionalObservations = extraNotes.join('; ');
    }
  }

  // 8. Actividad en proceso o culminada
  const statusMatch = text.match(/📌8[.-]?\s*Actividad\s+en\s+proceso\s+o\s+culminada:?\s*[\r\n]+(?:✓\s*)?([^\n📌]+)/i);
  if (statusMatch && statusMatch[1]) {
    const rawStatus = statusMatch[1].trim().toUpperCase();
    if (rawStatus.includes('CULMINADA')) result.status = 'CULMINADA';
    else if (rawStatus.includes('PROCESO')) result.status = 'EN PROCESO';
    else if (rawStatus.includes('REPUESTO') || rawStatus.includes('PENDIENTE')) result.status = 'PENDIENTE POR REPUESTO';
  }

  // 9. Sede
  const sedeMatch = text.match(/📌9[.-]?\s*Sede:?\s*([^\n📌]+)/i);
  if (sedeMatch && sedeMatch[1]) {
    result.sede = sedeMatch[1].trim();
  }

  return result;
}

/**
 * Returns today's date formatted as DD/MM/AAAA
 */
export function getTodayFormatted(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Returns yesterday's date formatted as DD/MM/AAAA
 */
export function getYesterdayFormatted(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Returns a friendly hour string, e.g. "desde las 11:30am"
 */
export function getCurrentTimeFormatted(): string {
  const d = new Date();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `desde las ${hours}:${minutes}${ampm}`;
}
