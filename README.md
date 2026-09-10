# MedLib URP 🏥📚
> **Biblioteca Virtual y Especializada de la Facultad de Medicina Humana "Manuel Velasco Suárez"**  
> Universidad Ricardo Palma — Lima, Perú

---

## 🏛️ Descripción Institucional

**MedLib URP** es la plataforma digital oficial de la Biblioteca Virtual y Especializada de la Facultad de Medicina Humana de la Universidad Ricardo Palma. Centraliza el acceso seguro a más de 40 recursos electrónicos biomédicos de élite, soporte de decisiones clínicas (Point-of-Care), revistas médicas internacionales y la gestión integral de acreditaciones de **Alfabetización Informacional (ALFIN)** para pregrado, internado y residentado médico.

---

## 🚀 Arquitectura del Monorepo

El sistema está diseñado bajo una arquitectura desacoplada y moderna:

```text
MedLib-URP/
├── frontend/                 # React 19 + TypeScript 5+ + TailwindCSS + Vite (pnpm)
│   ├── src/
│   │   ├── assets/logos/     # 44 logotipos institucionales y biomédicos autoalojados
│   │   ├── components/       # Componentes visuales y layout institucional
│   │   ├── features/         # Vertical Feature Slices (guides, conferences, attendance)
│   │   └── pages/            # Páginas principales (HomePage, etc.)
│   └── Dockerfile.frontend   # Nginx Alpine ultraligero
│
├── backend/                  # C# ASP.NET Core Web API (.NET 10 LTS) [En desarrollo]
│   ├── src/                  # Clean Architecture (Domain, Application, Infrastructure, Api)
│   └── Dockerfile.backend    # Contenedor .NET 10 LTS
│
├── docker-compose.yml        # Orquestación completa local (Front + Back + Postgres)
└── README.md
```

---

## 🔒 Cumplimiento de Políticas y Reglas de Negocio

- **Regla RN-04 (Seguridad de Enlaces Institucionales):** Los recursos bajo suscripción universitaria (ClinicalKey, AccessMedicina, DynaMedex) no exponen proxies directos a usuarios externos; redirigen al acceso seguro mediante la Intranet URP.
- **Ley N° 29733 (Protección de Datos Personales):** Encriptación en reposo, enmascaramiento dinámico (DDM) y minimización de registros transitorios de asistencia a 30 días (`RN-06`).
- **Autonomía de Logotipos:** Cero dependencia o hotlinking externo a servidores de terceros; todos los 44 logotipos residen localmente.

---

## 🛠️ Instrucciones de Ejecución Local

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

## 👥 Equipo y Créditos
- **Facultad de Medicina Humana URP:** Jefatura de Biblioteca (Lic. Francisca Valero) y especialistas en Bibliotecología e Informática.
- **Desarrollo de Software:** Joshua (@Cjoshue18)