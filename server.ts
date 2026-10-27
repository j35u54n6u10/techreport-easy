import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client if API key is present
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Endpoint: AI Parsing of technician's freeform text or WhatsApp draft
app.post('/api/ai/parse-report', async (req, res) => {
  try {
    const { prompt, currentContext } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Se requiere el texto para procesar.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'El servicio de IA no está configurado (falta GEMINI_API_KEY en variables de entorno).'
      });
    }

    const systemInstruction = `Eres un asistente técnico de soporte e informática para la DIRECCIÓN REGIONAL DEL ESTADO BOLIVARIANO ARAGUA (Tribunales y Circuitos Judiciales de Maracay, Aragua).
Tu misión es transformar notas desordenadas, explicaciones en jerga común, dictados de voz o mensajes de WhatsApp en el formato oficial estructurado de 9 puntos:
1. Nombre De la Actividad (título técnico formal)
2. Objetivo O Finalidad (párrafo técnico detallado y pulido: diagnóstico, intervención, pruebas y resultado)
3. Fecha (formato DD/MM/AAAA)
4. Ubicación (Área o puesto de trabajo específico)
5. Hora (ej: "desde las 11:30am" o rango horario)
6. Cantidad De Población Beneficiada (personas o funcionarios beneficiados)
7. Observaciones Generales y Técnicos participantes con sus cargos
8. Actividad en proceso o culminada (CULMINADA, EN PROCESO, o PENDIENTE)
9. Sede institucional

Usa siempre tono institucional, técnico, impecable y respetuoso. Si algún dato no se menciona en las notas, infiérelo coherentemente según el contexto judicial/técnico de Aragua o usa valores predeterminados sensatos.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Procesa y estructura el siguiente informe a partir de estas notas o texto:
"""${prompt}"""

Contexto previo si aplica: ${JSON.stringify(currentContext || {})}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            institution: { type: Type.STRING, description: 'Institución (ej: DIRECCIÓN REGIONAL DEL ESTADO BOLIVARIANO ARAGUA)' },
            activityName: { type: Type.STRING, description: 'Nombre formal de la actividad técnica' },
            objective: { type: Type.STRING, description: 'Objetivo o finalidad técnica con redacción institucional' },
            date: { type: Type.STRING, description: 'Fecha en formato DD/MM/AAAA' },
            locationArea: { type: Type.STRING, description: 'Área o puesto de trabajo' },
            timeRange: { type: Type.STRING, description: 'Hora o rango horario de la actividad' },
            beneficiaries: { type: Type.STRING, description: 'Población o funcionarios beneficiados' },
            technicians: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de nombres de técnicos con cargo (ej: "Anyelina Damas Técnico III")'
            },
            status: { type: Type.STRING, description: 'CULMINADA, EN PROCESO o PENDIENTE' },
            sede: { type: Type.STRING, description: 'Sede judicial o administrativa' },
            additionalNotes: { type: Type.STRING, description: 'Observaciones extras, materiales o insumos' },
          },
          required: ['activityName', 'objective', 'date', 'locationArea', 'timeRange', 'beneficiaries', 'technicians', 'status', 'sede']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/parse-report:', error);
    return res.status(500).json({ error: error.message || 'Error procesando informe con IA' });
  }
});

// 2. Endpoint: Improve objective description into formal technical prose
app.post('/api/ai/improve-text', async (req, res) => {
  try {
    const { rawText, activityName, locationArea } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: 'Texto requerido.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY no disponible.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Reescribe y perfecciona el siguiente texto para que sea el "Objetivo O Finalidad" de un informe técnico oficial para la Dirección Regional de Aragua (Tribunales/Circuitos Judiciales).
Debe redactarse en tercera persona / impersonal ("Se llevó a cabo...", "Tras el diagnóstico...", "Se procedió a..."), explicando:
- Diagnóstico técnico de la falla o requerimiento.
- Procedimiento realizado y herramientas o repuestos técnicos involucrados.
- Pruebas físicas/lógicas de conectividad, operatividad o funcionamiento realizadas.
- Conclusión satisfactoria de la operatividad del equipo o red.

Actividad: ${activityName || 'Soporte técnico'}
Ubicación: ${locationArea || 'Área administrativa'}
Texto base o notas del técnico:
"""${rawText}"""

Devuelve ÚNICAMENTE el texto redactado en un solo párrafo impecable, sin comillas ni títulos adicionales.`,
    });

    return res.json({ success: true, improvedText: (response.text || '').trim() });
  } catch (error: any) {
    console.error('Error in /api/ai/improve-text:', error);
    return res.status(500).json({ error: error.message || 'Error al mejorar redacción' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Development vs Production serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
