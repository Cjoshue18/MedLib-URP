# MedLib URP
> **Biblioteca Virtual y Especializada de la Facultad de Medicina Humana "Manuel Velasco Suárez"**  
> Universidad Ricardo Palma — Lima, Perú

---

## Descripción Institucional

**MedLib URP** es la plataforma digital oficial de la Biblioteca Virtual y Especializada de la Facultad de Medicina Humana de la Universidad Ricardo Palma. Centraliza el acceso seguro a recursos electrónicos biomédicos de élite, soporte de decisiones clínicas, revistas médicas internacionales y la gestión integral de acreditaciones de **Alfabetización Informacional (ALFIN)** para pregrado, internado y residentado médico.

---

## Arquitectura y Organización del Proyecto

El monorepo implementa **Vertical Feature Slices** en el Frontend y una arquitectura modular desacoplada en el Backend ASP.NET Core:

```text
MedLib-URP/
├── database/                                 # Scripts DDL y esquemas relacionales
│   └── init_medlib_urp_sqlserver.sql         # Script maestro DDL en T-SQL (Microsoft SQL Server)
│
├── frontend/                                 # Aplicación Web SPA (React 19 + TypeScript + TailwindCSS + Vite)
│   ├── src/
│   │   ├── assets/                           # Identidad visual institucional y logos vectoriales
│   │   ├── components/                       # Componentes globales de interfaz (Header, Footer, Navbar)
│   │   ├── features/                         # Vertical Feature Slices (módulos funcionales autónomos)
│   │   │   ├── auth/                         # Autenticación administrativa (Login, Tokens, Mutex)
│   │   │   ├── guides/                       # Directorio de bases de datos, administración y modal CRUD
│   │   │   ├── home/                         # Matriz molecular hexagonal dinámica y Bento Grid
│   │   │   └── community/                    # Módulo de interacción académica
│   │   ├── pages/                            # Vistas principales orquestadoras
│   │   │   ├── HomePage.tsx                  # Portada institucional y matriz interactiva
│   │   │   ├── DirectoryPage.tsx             # Catálogo completo con filtrado avanzado por materia
│   │   │   ├── AdminPage.tsx                 # Panel de gestión administrativa FAMURP
│   │   │   ├── ConferencesPage.tsx           # Asistencias y acreditación ALFIN
│   │   │   └── LostFoundPage.tsx             # Registro de objetos perdidos en biblioteca
│   │   ├── App.tsx                           # Enrutador principal de la aplicación
│   │   ├── main.tsx                          # Punto de entrada React 19
│   │   └── index.css                         # Sistema de diseño, tokens tipográficos y estilos globales
│   ├── package.json
│   └── vite.config.ts                        # Configuración de Vite y proxy local al backend
│
├── backend/                                  # API RESTful en C# ASP.NET Core (.NET 10 LTS)
│   └── src/MedLib.Api/
│       ├── Common/                           # Utilidades transversales y contratos
│       │   ├── Interfaces/                   # ITokenService, IRefreshTokenService, IPasswordHasher
│       │   └── Security/                     # JwtTokenService, RefreshTokenService, BCryptPasswordHasher
│       ├── Domain/                           # Entidades del modelo relacional de negocio
│       │   └── Entities/                     # BaseDatosMedica, Materia, UsuarioAdmin, RefreshToken, etc.
│       ├── Features/                         # Controladores y DTOs agrupados por dominio
│       │   ├── Auth/                         # AuthController (login, refresh, revoke, me) y AuthDtos
│       │   └── Resources/                    # ResourcesController, AdminResourcesController y DTOs
│       ├── Infrastructure/                   # Acceso a datos y persistencia
│       │   └── Persistence/                  # MedLibDbContext (EF Core con Npgsql / SqlServer)
│       ├── Program.cs                        # Configuración de servicios, autenticación JWT y middleware
│       ├── appsettings.json                  # Parámetros de configuración de la API
│       └── MedLib.Api.csproj
│
├── docker-compose.yml                        # Orquestación de contenedores Docker
├── .env.example                              # Plantilla de variables de entorno requeridas
└── README.md
```

---

## Mapa y Estructura de la Base de Datos

El modelo relacional está compuesto por 6 tablas optimizadas con índices dedicados y borrado en cascada:

```
                      +-----------------------------+
                      |       t_usuario_admin       |
                      |-----------------------------|
                      | PK  id_usuario_admin        |
                      |     username                |
                      |     password_hash (BCrypt)  |
                      |     nombres                 |
                      |     rol                     |
                      |     estado_activo           |
                      +-----------------------------+
                                     | 1
                                     |
                                     | N
                      +-----------------------------+
                      |       t_refresh_token       |
                      |-----------------------------|
                      | PK  id_refresh_token        |
                      | FK  id_usuario_admin        |
                      |     family_id (UUID)        |
                      |     token_hash (SHA-256)    |
                      |     fecha_expiracion        |
                      |     revocado                |
                      |     reemplazado_por...      |
                      +-----------------------------+


  +-----------------------------+                     +-----------------------------+
  |    t_base_datos_biomedica   |                     |          t_materia          |
  |-----------------------------|                     |-----------------------------|
  | PK  id_base_datos           |                     | PK  id_materia              |
  |     nombre_recurso          |                     |     nombre_materia          |
  |     logotipo_url            |                     +-----------------------------+
  |     descripcion_clinica     |                                    | 1
  |     es_suscripcion          |                                    |
  |     tiene_app_movil         |                                    | N
  |     mostrar_en_hexagonos    |                     +-----------------------------+
  |     estado_activo           |                     |   t_base_relacion_materia   |
  +-----------------------------+                     |-----------------------------|
                 | 1                                  | PK,FK  id_base_datos        |
                 +----------------------------------> | PK,FK  id_materia           |
                 |                                    +-----------------------------+
                 | 1
                 v 1
  +-----------------------------+
  |      t_tutorial_recurso     |
  |-----------------------------|
  | PK  id_tutorial             |
  | FK  id_base_datos           |
  |     titulo_video            |
  |     youtube_video_id        |
  |     guia_pdf_url            |
  +-----------------------------+
```

### Detalle de Tablas

| Tabla | Propósito | Llaves Foráneas / Índices |
| :--- | :--- | :--- |
| **`t_usuario_admin`** | Cuentas de personal de biblioteca con acceso al backoffice administrativo. | PK: `id_usuario_admin`. Unique: `username`. |
| **`t_refresh_token`** | Almacén de sesiones con rotación (RTR), Grace Period y detección de repetición. | FK: `id_usuario_admin`. Índices: `token_hash`, `family_id`. |
| **`t_base_datos_biomedica`** | Catálogo oficial de recursos, suscripciones y accesos institucionales. | PK: `id_base_datos`. Índice: `estado_activo`. |
| **`t_materia`** | Catálogo de asignaturas y especialidades clínicas de FAMURP. | PK: `id_materia`. Unique: `nombre_materia`. |
| **`t_base_relacion_materia`** | Tabla asociativa N:M para relacionar recursos con múltiples materias médicas. | PK compuesta: (`id_base_datos`, `id_materia`). Cascading delete. |
| **`t_tutorial_recurso`** | Vinculación 1:1 de videos tutoriales oficiales de YouTube y guías PDF. | PK: `id_tutorial`. Unique / FK: `id_base_datos`. |

---

## Seguridad y Ciclo de Vida de Tokens

La plataforma implementa el **Gold Standard de OAuth 2.0 BCP (RFC 6819)**:
* **Access Token (JWT):** Vigencia de **15 minutos**. Transporta claims esenciales (`sub`, `name`, `role`) firmado con HMAC-SHA256.
* **Refresh Token Criptográfico (RTR):** Vigencia de **7 días**. 64 bytes de entropía en Base64Url, almacenado con hash **SHA-256** en base de datos.
* **Ventana de Gracia (*Grace Period*):** Tolerancia de 30 segundos en la rotación para evitar falsos positivos por concurrencia entre pestañas o microcortes de red.
* **Árbol de Familia (*Token Families*):** Invalida únicamente el dispositivo comprometido ante la detección de un ataque de repetición (*replay attack*).
* **Purga Oportunista:** Limpieza automática de tokens expirados en cada evento de login/refresco (cero acumulación de basura en base de datos).

---

## Instrucciones de Ejecución Local

### Prerrequisitos
* **Node.js 20+** con **pnpm** (`corepack enable`)
* **.NET 10 SDK** (o versión LTS compatible)
* Acceso a base de datos PostgreSQL (Neon) o SQL Server local/remoto

### 1. Backend (.NET 10 Web API)
```bash
cd backend/src/MedLib.Api
dotnet restore
dotnet run --urls "http://localhost:5050"
```
La API estará escuchando en `http://localhost:5050`.

### 2. Frontend (React 19)
```bash
cd frontend
pnpm install
pnpm dev
```
La aplicación web estará disponible en `http://localhost:5173` (con proxy inverso automático hacia el puerto `5050`).

---

## Cumplimiento de Políticas Institucionales
- **SUNEDU / IAC-CINDA:** Trazabilidad de accesos a colecciones científicas especializadas para procesos de reacreditación.
- **Ley N° 29733 (Protección de Datos Personales):** Cifrado unidireccional con BCrypt, tokens sin estado y minimización de datos en memoria.
- **Autonomía de Recursos:** Entrega directa optimizada de logotipos WebP alojados en almacenamiento S3 de alta velocidad.

---

## Autor y Desarrollo
* **Desarrollador Principal:** Joshua Correa (@Cjoshue18)
* **Institución:** Facultad de Medicina Humana "Manuel Velasco Suárez" — Universidad Ricardo Palma