export interface Technician {
  id: string;
  name: string;
  role: string;
}

export interface LocationPreset {
  id: string;
  name: string;
  address: string;
}

export interface TemplateActivity {
  id: string;
  title: string;
  category: 'redes' | 'hardware' | 'software' | 'impresoras' | 'seguridad' | 'servidores';
  defaultObjective: string;
  defaultLocation: string;
  defaultBeneficiaries: string;
  suggestedMaterials?: string[];
}

export type ReportStatus = 'CULMINADA' | 'EN PROCESO' | 'PENDIENTE POR REPUESTO' | 'CANCELADA';

export interface ReportData {
  id: string;
  institution: string;
  activityName: string;
  objective: string;
  date: string; // DD/MM/AAAA
  locationArea: string;
  timeRange: string;
  beneficiaries: string;
  technicians: string[]; // List of formatted strings: "Name Role"
  additionalObservations: string;
  status: ReportStatus;
  sede: string;
  materialsUsed: string[];
  photos: string[]; // Base64 data URLs
  applicantName?: string; // Optional name of employee who received service
  ticketNumber?: string;
  createdAt: number;
  updatedAt: number;
}
