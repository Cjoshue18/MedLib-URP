# MedLib URP

> Biblioteca Virtual y Especializada de la Facultad de Medicina Humana "Manuel Velasco Suárez"
> Universidad Ricardo Palma, Lima, Perú

---

## Descripción Institucional

MedLib URP es la plataforma digital de la Biblioteca Virtual y Especializada de la Facultad de Medicina Humana de la Universidad Ricardo Palma. Centraliza el acceso a recursos electrónicos médicos, soporte de decisiones clínicas, revistas médicas internacionales y la gestión de capacitaciones y acreditaciones de Alfabetización Informacional (ALFIN) para pregrado, internado y residentado médico.

---

## Arquitectura y Organización del Proyecto

El monorepo implementa Vertical Feature Slices en el Frontend y una arquitectura modular desacoplada en el Backend con ASP.NET Core:

```text
MedLib-URP/
├── database/                                 # Scripts DDL y esquemas relacionales
│   └── init_medlib_urp_sqlserver.sql         # Script maestro DDL en T-SQL
│
├── frontend/                                 # Aplicación Web SPA (React 19, TypeScript, TailwindCSS, Vite)
│   ├── src/
│   │   ├── assets/                           # Identidad visual institucional y logos
│   │   ├── components/                       # Componentes globales de interfaz (Header, Footer, Navbar)
│   │   ├── features/                         # Vertical Feature Slices
│   │   │   ├── attendance/                   # Exportación determinística de reportes a Excel
│   │   │   │   └── services/                 # excelExportService
│   │   │   ├── auth/                         # Autenticación administrativa (Login, Tokens, Sesión)
│   │   │   │   ├── components/               # AdminLoginForm
│   │   │   │   └── services/                 # authService
│   │   │   ├── community/                    # Feed oficial de Instagram y Objetos Perdidos
│   │   │   │   ├── components/               # AdminLostFoundTab, InstagramCarousel, InstagramPostEmbed
│   │   │   │   └── services/                 # instagramService, lostFoundService
│   │   │   ├── conferences/                  # Capacitaciones ALFIN y asistencias
│   │   │   │   ├── components/
│   │   │   │   │   ├── admin/                # Panel de conferencias, estadísticas y reportes
│   │   │   │   │   ├── calendar/             # Calendario mensual interactivo y tarjetas
│   │   │   │   │   └── attendance/           # Vistas y modales de inscripción y marcación en vivo
│   │   │   │   ├── services/                 # conferenceService
│   │   │   │   └── types.ts                  # Contratos y tipos de conferencias
│   │   │   ├── guides/                       # Directorio de bases de datos médicas
│   │   │   │   ├── components/
│   │   │   │   │   ├── admin/                # Gestión de recursos, matrices y modales CRUD
│   │   │   │   │   └── directory/            # Acordeones y fichas técnicas por materia
│   │   │   │   └── services/                 # resourceService
│   │   │   └── home/                         # Portada institucional y red molecular
│   │   │       └── components/               # HomeBentoGrid, BentoHexCard, HomeBentoMolecularBonds, HomeHero
│   │   ├── pages/                            # Vistas principales orquestadoras
│   │   │   ├── HomePage.tsx                  # Portada institucional
│   │   │   ├── DirectoryPage.tsx             # Catálogo de recursos con filtrado por especialidad
│   │   │   ├── ConferencesPage.tsx           # Calendario ALFIN e inscripciones
│   │   │   ├── LostFoundPage.tsx             # Registro de objetos perdidos en biblioteca
│   │   │   └── AdminPage.tsx                 # Panel de administración general
│   │   ├── App.tsx                           # Enrutador de vistas
│   │   ├── main.tsx                          # Punto de entrada
│   │   └── index.css                         # Sistema de diseño y tokens tipográficos
│   ├── package.json
│   └── vite.config.ts                        # Configuración de Vite y proxy local
│
├── backend/                                  # API RESTful en C# ASP.NET Core (.NET 10 LTS)
│   └── src/MedLib.Api/
│       ├── Common/                           # Utilidades transversales y contratos de seguridad
│       │   ├── Interfaces/                   # ITokenService, IRefreshTokenService, IPasswordHasher
│       │   └── Security/                     # JwtTokenService, RefreshTokenService, BCryptPasswordHasher
│       ├── Domain/                           # Entidades del modelo relacional
│       │   └── Entities/                     # BaseDatosMedica, Materia, ConferenciaMedica, etc.
│       ├── Features/                         # Controladores y DTOs agrupados por dominio
│       │   ├── Auth/                         # AuthController y AuthDtos
│       │   ├── Conferences/                  # ConferencesController, AdminConferencesController y DTOs
│       │   ├── LostFound/                    # LostFoundController y DTOs
│       │   └── Resources/                    # ResourcesController, AdminResourcesController y DTOs
│       ├── Infrastructure/                   # Acceso a datos y persistencia
│       │   └── Persistence/                  # MedLibDbContext (EF Core con Npgsql o SqlServer)
│       ├── Program.cs                        # Configuración de servicios, JWT y middleware
│       ├── appsettings.json                  # Parámetros de configuración
│       └── MedLib.Api.csproj
│
├── docker-compose.yml                        # Orquestación de contenedores Docker
├── package.json                              # Scripts del monorepo (pnpm workspace)
├── pnpm-workspace.yaml                       # Definición de paquetes pnpm
└── README.md
```

---

## Modelo Relacional de la Base de Datos

El modelo relacional está compuesto por 10 tablas optimizadas con índices dedicados y borrado en cascada en las relaciones dependientes:

### Catálogo de Tablas

| Tabla | Dominio | Propósito | Llaves e Índices |
| :--- | :--- | :--- | :--- |
| **`t_usuario_admin`** | Seguridad | Cuentas de personal de biblioteca con acceso administrativo. | PK: `id_usuario_admin`. Unique: `username`. |
| **`t_refresh_token`** | Seguridad | Sesiones persistentes con rotación de tokens (RTR) y control de familias. | FK: `id_usuario_admin`. Índices: `token_hash`, `family_id`. |
| **`t_base_datos_medica`** | Recursos | Catálogo oficial de bases de datos médicas, suscripciones y enlaces. | PK: `id_base_datos`. Índice: `estado_activo`. |
| **`t_materia`** | Recursos | Catálogo de asignaturas y especialidades clínicas de FAMURP. | PK: `id_materia`. Unique: `nombre_materia`. |
| **`t_base_relacion_materia`** | Recursos | Tabla asociativa N:M entre recursos y materias médicas. | PK compuesta: (`id_base_datos`, `id_materia`). Cascading delete. |
| **`t_tutorial_recurso`** | Recursos | Enlace 1:1 de videos tutoriales oficiales de YouTube y guías PDF. | PK: `id_tutorial`. Unique y FK: `id_base_datos`. |
| **`t_conferencia_medica`** | Conferencias | Eventos y capacitaciones ALFIN programadas o en curso. | PK: `id_conferencia`. Índice: `fecha_hora_inicio`. |
| **`t_inscripcion`** | Conferencias | Registro de participantes inscritos previamente a un evento. | PK: `id_inscripcion`. Unique: (`id_conferencia`, `numero_documento`). |
| **`t_asistencia`** | Conferencias | Marcación de asistencia en tiempo real durante la conferencia. | PK: `id_asistencia`. Unique: (`id_conferencia`, `numero_documento`). |
| **`t_objeto_perdido_post`** | Comunidad | Publicaciones sincronizadas de objetos encontrados en biblioteca. | PK: `id_post`. |

---

## Seguridad y Ciclo de Vida de Tokens

La plataforma implementa las recomendaciones del perfil OAuth 2.0 BCP (RFC 6819):

* **Access Token (JWT):** Vigencia de 15 minutos. Transporta claims esenciales (`sub`, `name`, `role`) firmado con HMAC-SHA256.
* **Refresh Token Criptográfico (RTR):** Vigencia de 7 días. Generado con 64 bytes de entropía en Base64Url y almacenado con hash SHA-256.
* **Ventana de Gracia (Grace Period):** Margen de 30 segundos en la rotación para prevenir bloqueos por concurrencia o microcortes de red.
* **Detección de Reúso (Token Families):** Invalida la cadena de tokens del cliente si se detecta un intento de repetición.
* **Purga Oportunista:** Eliminación automática de tokens caducados durante operaciones de autenticación.

---

## Instrucciones de Ejecución Local

### Prerrequisitos

* **Node.js 20 o superior** con **pnpm** habilitado (`corepack enable`)
* **.NET 10 SDK** (o versión compatible)
* Base de datos PostgreSQL o SQL Server configurada en `.env` o `appsettings.json`

### 1. Instalación de Dependencias

Desde la raíz del repositorio:

```bash
pnpm install
```

### 2. Ejecución del Backend (.NET 10 Web API)

```bash
dotnet run --project backend/src/MedLib.Api
```

La API inicia en `http://localhost:5050`.

### 3. Ejecución del Frontend (React 19)

Desde la raíz del proyecto o dentro del directorio `frontend`:

```bash
pnpm dev
```

La aplicación web abre en `http://localhost:5173`, comunicándose con la API mediante el proxy configurado en Vite.

### 4. Verificación de Compilación y Tipos

```bash
pnpm build
pnpm typecheck
```

---

## Políticas y Estándares de Calidad

* **SUNEDU e IAC-CINDA:** Registro y trazabilidad de acceso a recursos de investigación para soporte en acreditaciones institucionales.
* **Ley N° 29733 (Protección de Datos Personales):** Almacenamiento seguro mediante hashes criptográficos, tokens efímeros y minimización de datos en memoria.

---

## Créditos y Contacto

* **Desarrollo:** Joshua Correa (@Cjoshue18)
* **Institución:** Facultad de Medicina Humana "Manuel Velasco Suárez", Universidad Ricardo Palma