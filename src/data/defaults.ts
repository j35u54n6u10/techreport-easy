import { ReportData, Technician, TemplateActivity } from '../types.ts';

export const DEFAULT_INSTITUTION = 'DIRECCIÓN REGIONAL DEL ESTADO BOLIVARIANO ARAGUA';

export const DEFAULT_SEDES = [
  'Circuito de Protección Maracay estado Aragua, edif Raila 2 c/c Paez y Sucre',
  'Palacio de Justicia del Estado Aragua, Av. Bolívar Oeste, Maracay',
  'Circuito Judicial Agrario del Estado Aragua, Maracay',
  'Circuito Judicial Laboral del Estado Aragua, Maracay',
  'Sede Administrativa / Archivo Central, Maracay',
];

export const DEFAULT_AREAS = [
  'Circuito Judicial Agrario',
  'Secretaría de Presidencia',
  'Sala de Audiencias N° 1',
  'Sala de Audiencias N° 2',
  'Sala de Servidores y Telecomunicaciones',
  'Alguacilazgo y Notificaciones',
  'Unidad de Recepción y Distribución de Documentos (URDD)',
  'Archivo Central de Expedientes',
  'Coordinación de Recursos Humanos',
  'Coordinación de Administración y Finanzas',
  'Oficina de Informática y Telemática',
];

export const DEFAULT_TECHNICIANS: Technician[] = [
  { id: '1', name: 'Anyelina Damas', role: 'Técnico III' },
  { id: '2', name: 'Andrea Paredes', role: 'Técnico III' },
  { id: '3', name: 'Derixon Leon', role: 'PASANTE' },
  { id: '4', name: 'Julio', role: 'Técnico de Soporte' },
  { id: '5', name: 'Jesús', role: 'Coordinador de Informática' },
];

export const DEFAULT_TEMPLATES: TemplateActivity[] = [
  {
    id: 'rj45-red',
    title: 'Mantenimiento Correctivo, Reemplazo de Jack Modular RJ45 y Restablecimiento de Conectividad en Red Local',
    category: 'redes',
    defaultObjective: 'Se llevó a cabo una intervención técnica correctiva en la estación de trabajo asignada, la cual presentaba fallas críticas de conectividad e imposibilidad de acceso a las carpetas compartidas y recursos de red institucional. Tras el diagnóstico con probador de red, se constató daño en el jack modular RJ45 hembra. Se procedió al reemplazo y ponchado del nuevo jack bajo norma T568B, seguido de pruebas de enlace físico y validación de acceso al dominio corporativo, logrando restablecer la operatividad total.',
    defaultLocation: 'Área Circuito Judicial Agrario',
    defaultBeneficiaries: 'Funcionaria y personal adscrito al área',
    suggestedMaterials: ['Jack Modular RJ45 Cat6', 'Patch Cord UTP 1.5m', 'Placa de pared / Faceplate'],
  },
  {
    id: 'mantenimiento-preventivo',
    title: 'Mantenimiento Preventivo Físico y Lógico de Estación de Trabajo',
    category: 'hardware',
    defaultObjective: 'Se ejecutó jornada de mantenimiento preventivo integral en el equipo de computación, que incluyó limpieza profunda interna con sopladora térmica, reemplazo de pasta disipadora en procesador, limpieza de contactos de memoria RAM y lubricación de ventiladores. En la parte lógica, se realizó desfragmentación de disco duro, depuración de archivos temporales del sistema y actualización de firmas antivirus institucionales, optimizando el rendimiento general del puesto de trabajo.',
    defaultLocation: 'Unidad de Recepción y Distribución de Documentos (URDD)',
    defaultBeneficiaries: 'Personal técnico y administrativo de la unidad',
    suggestedMaterials: ['Pasta térmica disipadora', 'Alcohol isopropílico', 'Limpia contactos'],
  },
  {
    id: 'impresora-red',
    title: 'Configuración, Instalación y Compartición de Impresora Departamental en Red Local',
    category: 'impresoras',
    defaultObjective: 'Se realizó la instalación y aprovisionamiento de impresora multifuncional departamental asignada a la dependencia. Se configuró asignación de dirección IP estática en el segmento de red correspondiente, instalación de controladores oficiales en los equipos clientes autorizados y configuración del servicio de digitalización (escáner a carpeta compartida). Se ejecutaron impresiones de prueba y calibración satisfactorias.',
    defaultLocation: 'Secretaría de Presidencia',
    defaultBeneficiaries: 'Jueces, secretarios y asistentes del tribunal',
    suggestedMaterials: ['Cable de red UTP Cat6', 'Cartucho de tóner', 'Patch cord'],
  },
  {
    id: 'formateo-so',
    title: 'Formateo, Reinstalación Limpia de Sistema Operativo y Respaldo Seguro de Archivos',
    category: 'software',
    defaultObjective: 'Ante degradación severa del sistema operativo e inestabilidad en la carga de módulos judiciales, se procedió a realizar un respaldo íntegro y verificado de expedientes, documentos institucionales y certificados de usuario. Posteriormente se efectuó formateo de bajo nivel, instalación limpia del sistema operativo corporativo, suite ofimática, visor de documentos PDF, antivirus y restauración íntegra de la estructura de archivos respaldada.',
    defaultLocation: 'Sala de Audiencias N° 1',
    defaultBeneficiaries: 'Personal de secretaría y sala',
    suggestedMaterials: ['Unidad de almacenamiento para respaldo temporal'],
  },
  {
    id: 'credenciales-dominio',
    title: 'Restablecimiento de Credenciales de Dominio, Perfil de Usuario y Correo Institucional',
    category: 'seguridad',
    defaultObjective: 'A solicitud del funcionario por bloqueo de seguridad o expiración de contraseña de acceso, se procedió en el Directorio Activo institucional al desbloqueo y restablecimiento seguro de las credenciales de red, reconfiguración del cliente de correo electrónico corporativo y verificación de políticas de grupo (GPO), validando el inicio de sesión exitoso y acceso a los recursos asignados.',
    defaultLocation: 'Coordinación de Recursos Humanos',
    defaultBeneficiaries: 'Funcionario solicitante y coordinación adscrita',
  },
  {
    id: 'punto-red-nuevo',
    title: 'Instalación y Canalización de Nuevo Punto de Red para Estación de Trabajo',
    category: 'redes',
    defaultObjective: 'Se ejecutó el tendido de cable UTP categoría 6 a través de canaleta perimetral desde el switch de piso hasta el puesto de trabajo habilitado. Se realizó ponchado de jack modular hembra en caja superficial de datos, verificación de continuidad y atenuación con probador de red digital, y posterior conexión de equipo de computación, garantizando transferencia de datos estable y acceso a la intranet institucional.',
    defaultLocation: 'Archivo Central de Expedientes',
    defaultBeneficiaries: 'Funcionarios de archivo y usuarios del sistema de expedientes',
    suggestedMaterials: ['25m Cable UTP Cat6', 'Canaleta plástica con adhesivo', 'Caja superficial con jack RJ45', 'Patch cord 2m'],
  },
];

export const INITIAL_REPORT: ReportData = {
  id: 'rep-initial',
  institution: DEFAULT_INSTITUTION,
  activityName: 'Mantenimiento Correctivo, Reemplazo de Jack Modular RJ45 y Restablecimiento de Conectividad en Red Local (Área Circuito Judicial Agrario)',
  objective: 'Se llevó a cabo una intervención técnica correctiva en la estación de trabajo asignada a la funcionaria Ana Paula, ubicada en el Circuito Judicial Agrario, la cual presentaba fallas críticas de conectividad e imposibilidad de acceso a las carpetas compartidas y recursos de red. Tras el diagnóstico, se constató que el jack modular (jack/conector hembra de red) se encontraba dañado. Se procedió al reemplazo y ponchado del nuevo jack, seguido de pruebas de enlace físico y validación de acceso al dominio e unidades compartidas corporativas, logrando restablecer la operatividad total de la estación.',
  date: '23/10/2026',
  locationArea: 'Circuito Judicial Agrario (Puesto de trabajo de Ana Paula)',
  timeRange: 'desde las 11:30am',
  beneficiaries: 'Funcionaria Ana Paula y personal adscrito al Circuito Judicial Agrario',
  technicians: [
    'Anyelina Damas Técnico III',
    'Andrea Paredes Técnico III',
    'Derixon Leon PASANTE',
  ],
  additionalObservations: 'Actividad realizada por el equipo de informática.',
  status: 'CULMINADA',
  sede: 'Circuito de Protección Maracay estado Aragua, edif Raila 2 c/c Paez y Sucre',
  materialsUsed: ['Jack Modular RJ45 Cat6', 'Conector RJ45 macho', 'Patch cord 1.5m'],
  photos: [],
  applicantName: 'Ana Paula',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};
