# MedLib URP
> **Biblioteca Virtual y Especializada de la Facultad de Medicina Humana "Manuel Velasco Suárez"**  
> Universidad Ricardo Palma — Lima, Perú

---

## Descripción Institucional

**MedLib URP** es la plataforma digital oficial de la Biblioteca Virtual y Especializada de la Facultad de Medicina Humana de la Universidad Ricardo Palma. Centraliza el acceso seguro a recursos electrónicos biomédicos de élite, soporte de decisiones clínicas, revistas médicas internacionales y la gestión integral de acreditaciones de **Alfabetización Informacional (ALFIN)** para pregrado, internado y residentado médico.

---

## Arquitectura del Monorepo

El sistema está diseñado bajo una arquitectura desacoplada y moderna:

```text
MedLib-URP/
├── frontend/                 # React 19 + TypeScript 5+ + TailwindCSS + Vite (pnpm)
│   ├── src/
│   │   ├── assets/logos/     # logotipos institucionales y biomédicos autoalojados
│   │   ├── components/       # Componentes visuales y layout institucional
│   │   ├── features/         # Vertical Feature Slices (guides, conferences, attendance)
│   │   └── pages/            # Páginas principales (HomePage, etc.)
│   └── Dockerfile.frontend   
│
├── backend/                  # C# ASP.NET Core Web API (.NET 10 LTS) [En desarrollo]
│   ├── src/                  # Clean Architecture (Domain, Application, Infrastructure, Api)
│   └── Dockerfile.backend    # Contenedor .NET 10 LTS
│
├── docker-compose.yml        # Orquestación completa local (Front + Back + Postgres)
└── README.md
```

---

## Cumplimiento de Políticas y Reglas de Negocio

- **Regla de Seguridad de Enlaces Institucionales:** Los recursos bajo suscripción universitaria no exponen proxies directos a usuarios externos; redirigen al acceso seguro mediante la Intranet URP.
- **Ley N° 29733 (Protección de Datos Personales):** Encriptación en reposo, enmascaramiento dinámico (DDM) y minimización de registros transitorios de asistencia a 30 días.

- **Autonomía de Logotipos:** Cero dependencia o hotlinking externo a servidores de terceros; todos los logotipos residen localmente.

---

## Instrucciones de Ejecución Local

### Ejecución Local

Desde la raíz del repositorio (`MedLib-URP`):
```bash
corepack pnpm install
corepack pnpm dev
```

O directamente dentro de `frontend/`:
```bash
cd frontend
corepack pnpm install
corepack pnpm dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## Créditos
- **Desarrollo del Software:** (@Cjoshue18)