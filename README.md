# Sistema RAG Híbrido para Consulta de Documentación Técnica y Código

**Proyecto Integrador - Ingeniería de Sistemas - UNICEN**

Este repositorio contiene la implementación completa de un sistema de **Generación Aumentada por Recuperación (RAG)** diseñado para responder consultas técnicas complejas sintetizando información de dos fuentes: **documentación teórica en PDF** y **repositorios de código en GitHub**.

El sistema, construido sobre **Langflow**, utiliza una arquitectura de microservicios contenerizada con **Docker** para garantizar su reproducibilidad. Emplea modelos avanzados de **OpenAI** y **NVIDIA** para la generación y recuperación semántica, respectivamente.

---

## Características Principales

* **Búsqueda Híbrida:** Ingesta y consulta simultánea de documentos PDF y repositorios de código.
* **Trazabilidad de Fuentes:** Cada respuesta generada incluye datos precisos que indican si la información proviene de un manual teórico, del repositorio de código o de la web.
* **Arquitectura Robusta:** Pipeline de ingesta con normalización de datos, etiquetado semántico y gestión de duplicados.
* **Recuperación Avanzada:** Utiliza NVIDIA Embeddings para vectorización y NVIDIA Reranker para refinar la relevancia del contexto.
* **Evaluación Integrada:** Incluye un framework de benchmark automatizado basado en el paradigma "LLM-as-a-Judge" para medir la precisión y completitud del sistema.
* **Despliegue Simplificado:** Todo el stack (frontend y backend) se levanta con un solo comando de Docker Compose.

---

## Arquitectura del Sistema

El sistema se compone de dos servicios principales orquestados por Docker Compose:

1.  **Backend (Langflow Custom):** Una instancia personalizada de Langflow que ejecuta los flujos RAG (ingesta y recuperación).
2.  **Frontend:** Una interfaz de chat web moderna que permite al usuario interactuar con el sistema y visualizar las respuestas con sus fuentes.

La persistencia de datos (índices vectoriales de ChromaDB y configuraciones) se maneja mediante volúmenes locales.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

* **Docker Desktop** con Docker Compose.
* Claves de API válidas para los siguientes servicios:
    * **OpenAI API Key** (para el modelo generativo GPT-4).
    * **NVIDIA NGC API Key** (para modelos de embeddings y reranking).
    * **JigsawStack API Key** (para búsqueda web complementaria).
    * **Langflow API Key** (para la conexion con los flujos).

---

## Instalación y Despliegue

Sigue estos pasos para levantar el proyecto en tu entorno local:

1. Clonar el repositorio:
git clone https://github.com/Gonzalibrandi/Tesis.git
2. Navegar a la carpeta del frontend del proyecto:
cd Tesis/frontend
3. Configurar las variables de entorno: el proyecto necesita claves de API para funcionar. Se usará el archivo de ejemplo .env.example como plantilla. Estando en la carpeta raíz (Tesis), se debe ejecutar:
# En Windows (PowerShell)
copy .env.example .env
# En macOS / Linux
cp .env.example .env
4. Levantar los contenedores por primera vez: este comando construirá las imágenes de Docker. La primera vez puede tardar varios minutos debido a la descarga de dependencias.
docker-compose up --build
Esperar a que el servicio langflow-container se estabilice.
5. Obtener la API Key de Langflow: una vez que el contenedor esté corriendo, abrí tu navegador y andá a: http://localhost:7860/settings/api-keys Crear una nueva clave de API y copiarla.
6. Completar el archivo .env: abrir el archivo .env que creaste dentro de la carpeta frontend en el paso 3 y rellenar todos los valores:
LANGFLOW_API_KEY="sk-..." # Pegar aquí la clave creada en el paso anterior
OPENAI_API_KEY="sk-..."
JIGSAWSTACK_API_KEY="sk_..."
NVIDIA_API_KEY="nvapi-..."
7. Reiniciar los contenedores: para que todos los servicios tomen las nuevas claves de API, detener los servicios desde Docker Desktop o con Ctrl + C y volvé a levantarlos.
docker-compose up

Ahora para acceder a los dos servicios desde un navegador se deben usar las siguientes URLs:
Aplicación Web: http://localhost:8080
Langflow (Entorno de desarrollo): http://localhost:7860

Una vez que el proyecto ya está instalado, para el uso diario, solo se necesita seguir estos pasos para ejecutarlo:
1. Abrir Docker Desktop.
2. Levantar ambos contenedores (Langflow y frontend)
3. Acceder a la aplicación web en http://localhost:8080

## Estructura del Repositorio
├── langflow_custom/    # Componentes y flujos personalizados  
│   ├── requirements.txt    # Dependencias de Python congeladas  
│   └── Dockerfile          # Definición de la imagen del backend  
├── langflow_data/      # Flujos de Langflow  
│   ├── Ingest Github Flow.json     # Flujo de ingesta github  
│   ├── Ingest PDF Flow.json        # Flujo de ingesta PDF  
│   └── Retriever Flow.json         # Flujo de recuperacion y generacion  
├── frontend/               # Código fuente del frontend  
│   ├── Dockerfile          # Definición de la imagen del frontend  
│   ├── src/                # Componentes React y lógica de cliente  
│   ├── .env.example        # Plantilla para variables de entorno  
│   └── package.json        # Dependencias  
├── benchmark/              # Herramientas y datos para la evaluación  
│   ├── 1er benchmark       # Archivos importantes del benchmark de las PPS  
│   └── 2do benchmark       # Archivos importantes del benchmark del PI  
└── docker-compose.yml      # Orquestación de todos los servicios  

Autor: Gonzalo Librandi  
Contacto: librandigonzalo@gmail.com  
Institución: UNICEN - Facultad de Ciencias Exactas  