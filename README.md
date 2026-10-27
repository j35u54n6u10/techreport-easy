# FormatoFácil - Reportes Técnicos Aragua

## Sinopsis

**FormatoFácil** es una aplicación web y PWA diseñada para agilizar la creación, gestión y distribución de reportes técnicos de soporte técnico e informática para la **Dirección Regional de Aragua**.

Permite a los técnicos y especialistas de TI:
- **Generación ágil de reportes:** Completar partes de novedades e intervenciones técnicas mediante formularios rápidos, plantillas predefinidas y un modo de llenado exprés (*Fast Fill*).
- **Vista previa y exportación multicanal:**
  - Formato listo para compartir directamente vía WhatsApp con texto optimizado y estructurado.
  - Generación de reportes imprimibles / exportables en PDF formal con membretes institucionales.
- **Asistencia inteligente con IA:** Integración con Gemini API para redacción técnica asistida, corrección de descripciones de novedades y extracción de datos desde mensajes informales.
- **Gestión local y respaldo:** Historial de reportes almacenados localmente en el navegador, gestión de técnicos y catálogos de actividades sin requerir infraestructura externa compleja.
- **Soporte PWA / Móvil:** Interfaz adaptativa optimizada tanto para escritorio como para dispositivos móviles en campo.

---

## Requisitos Previos

- **Node.js** (versión 18 o superior recomendada)
- **npm**

---

## Instalación y Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno (opcional para funciones con IA):
   - Copia `.env.example` a `.env` y añade tu `GEMINI_API_KEY`:
     ```bash
     cp .env.example .env
     ```

---

## Ejecución

- **Modo Desarrollo:**
  ```bash
  npm run dev
  ```
- **Construir para Producción:**
  ```bash
  npm run build
  ```
- **Vista previa de producción:**
  ```bash
  npm run preview
  ```

