// Catálogo Oficial de Bases de Datos y Recursos Biomédicos - MedLib URP
// Generado conforme a la extracción de Elogim y la regla institucional RN-04.

export type DatabaseCategory =
  | 'Todas'
  | 'Especializada'
  | 'Herramientas Clínicas'
  | 'Revistas y Libros'
  | 'Multidisciplinaria'
  | 'Acceso Abierto';

export type AccessType = 'Suscripción URP' | 'Acceso Abierto';

export interface BiomedicalDatabase {
  id: string;
  title: string;
  description: string;
  category: DatabaseCategory;
  accessType: AccessType;
  logoFile: string;
  accessUrl: string;
  isFeatured?: boolean;
  tutorialUrl?: string;
  tags: string[];
}

/**
 * Resuelve la URL del logo de la base de datos biomédica.
 * Soporta buckets de almacenamiento en la nube (S3, Cloud Storage, etc.)
 * para no almacenar archivos binarios dentro del repositorio git.
 */
export const getDatabaseLogoUrl = (logoFile?: string): string => {
  if (!logoFile) return '';
  const bucketUrl = (import.meta.env.VITE_LOGOS_BUCKET_URL as string) || '';
  if (bucketUrl) {
    return `${bucketUrl.replace(/\/$/, '')}/${logoFile}`;
  }
  return `/logos/${logoFile}`;
};

export const DATABASES_DATA: BiomedicalDatabase[] = [
  {
    "id": "clinicalkey-espanol",
    "title": "ClinicalKey Español",
    "description": "Plataforma líder de Elsevier para el soporte de decisiones clínicas, libros de texto de referencia médica (Harrison, Guyton, Robbins), revistas de alto impacto, vademécum y miles de guías de práctica clínica.",
    "category": "Especializada",
    "accessType": "Suscripción URP",
    "logoFile": "clinicalkeyespanol.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tutorialUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "tags": [
      "Medicina General",
      "Libros Médicos",
      "Guías Clínicas",
      "Elsevier"
    ]
  },
  {
    "id": "clinicalkey-student",
    "title": "ClinicalKey Student Foundation & Medicine",
    "description": "Recurso interactivo esencial para estudiantes de medicina de pregrado. Acceso a colecciones completas de ciencias básicas, anatomía 3D, autoevaluaciones y videos procedimentales.",
    "category": "Especializada",
    "accessType": "Suscripción URP",
    "logoFile": "clinicalkeystudent.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "Pregrado",
      "Anatomía",
      "Farmacología",
      "Fisiología"
    ]
  },
  {
    "id": "accessmedicina",
    "title": "AccessMedicina (McGraw-Hill)",
    "description": "Biblioteca integral con obras canónicas como Goodman & Gilman, Principios de Medicina Interna de Harrison, Cirugía de Schwartz, además de pruebas diagnósticas, calculadoras y casos clínicos.",
    "category": "Especializada",
    "accessType": "Suscripción URP",
    "logoFile": "accessmedicina-espanol.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "McGraw-Hill",
      "Harrison",
      "Goodman & Gilman",
      "Casos Clínicos"
    ]
  },
  {
    "id": "dynamedex",
    "title": "DynaMedex (EBSCO)",
    "description": "Herramienta de medicina basada en evidencia para toma de decisiones al pie de cama del paciente (Point-of-Care). Actualizada diariamente con revisiones sistemáticas de alta graduación GRADE.",
    "category": "Herramientas Clínicas",
    "accessType": "Suscripción URP",
    "logoFile": "dynamedex.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "Point of Care",
      "Medicina Basada en Evidencias",
      "GRADE",
      "EBSCO"
    ]
  },
  {
    "id": "bmj-best-practice",
    "title": "BMJ Best Practice",
    "description": "Guía clínica interactiva y soporte diagnóstico estructurado paso a paso desde el síntoma inicial hasta el plan de tratamiento y pronóstico, avalada por The British Medical Journal.",
    "category": "Herramientas Clínicas",
    "accessType": "Suscripción URP",
    "logoFile": "bmjbestpractice.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "BMJ",
      "Soporte Clínico",
      "Algoritmos Diagnósticos"
    ]
  },
  {
    "id": "the-bmj",
    "title": "The BMJ (British Medical Journal)",
    "description": "Una de las revistas médicas revisadas por pares más influyentes y prestigiosas del mundo, con investigaciones originales, ensayos clínicos y debates en salud global.",
    "category": "Revistas y Libros",
    "accessType": "Suscripción URP",
    "logoFile": "britishmedicaljournal-thebmj.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "Revistas Q1",
      "Epidemiología",
      "Investigación Clínica"
    ]
  },
  {
    "id": "nejm",
    "title": "The New England Journal of Medicine (NEJM)",
    "description": "La revista médica general más leída, citada e influyente del mundo. Publica investigaciones biomédicas de vanguardia, casos clínicos anatomopatológicos e imágenes en medicina clínica.",
    "category": "Revistas y Libros",
    "accessType": "Suscripción URP",
    "logoFile": "newenglandjournalofmedicine.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "Impact Factor Líder",
      "Ensayos Fase 3",
      "Casos Clínicos"
    ]
  },
  {
    "id": "5minute-consult",
    "title": "5MinuteConsult",
    "description": "Referencia rápida para atención primaria y urgencias. Algoritmos de abordaje inmediato para más de 2,000 condiciones médicas, dosis pediátricas y de adultos.",
    "category": "Herramientas Clínicas",
    "accessType": "Suscripción URP",
    "logoFile": "5minuteconsult.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Urgencias",
      "Atención Primaria",
      "Algoritmos"
    ]
  },
  {
    "id": "health-library-clerkship",
    "title": "Health Library Clerkship (Wolters Kluwer)",
    "description": "Recursos especializados y textos esenciales para el externado médico e internado hospitalario, con textos de semiología, cirugía, pediatría y ginecología-obstetricia.",
    "category": "Especializada",
    "accessType": "Suscripción URP",
    "logoFile": "healthlibraryclerkship.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Internado",
      "Externado",
      "Rotaciones Clínicas"
    ]
  },
  {
    "id": "biodigital",
    "title": "BioDigital Human",
    "description": "Plataforma de visualización anatómica 3D interactiva del cuerpo humano, fisiología interactiva y modelos patológicos detallados para aprendizaje médico inmersivo.",
    "category": "Especializada",
    "accessType": "Suscripción URP",
    "logoFile": "biodigital.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Anatomía 3D",
      "Fisiología",
      "Simulación"
    ]
  },
  {
    "id": "scopus",
    "title": "Scopus (Elsevier)",
    "description": "La mayor base de datos de citas y resúmenes de bibliografía médica y científica revisada por pares. Herramienta fundamental para revisiones sistemáticas, metaanálisis y bibliometría.",
    "category": "Multidisciplinaria",
    "accessType": "Suscripción URP",
    "logoFile": "scopus.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "Bibliometría",
      "Índice H",
      "Revisiones Sistemáticas",
      "Elsevier"
    ]
  },
  {
    "id": "sciencedirect",
    "title": "ScienceDirect (Elsevier)",
    "description": "Plataforma multidisciplinaria con millones de artículos a texto completo de revistas científicas y capítulos de libros en medicina, bioquímica y ciencias de la salud.",
    "category": "Multidisciplinaria",
    "accessType": "Suscripción URP",
    "logoFile": "sciencedirect.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": true,
    "tags": [
      "Texto Completo",
      "Artículos Científicos",
      "Elsevier"
    ]
  },
  {
    "id": "nature",
    "title": "Nature Medicine & Portfolio",
    "description": "Artículos de investigación de alto impacto en biomedicina translacional, genómica, inmunología y ensayos clínicos de frontera en el grupo Nature.",
    "category": "Revistas y Libros",
    "accessType": "Suscripción URP",
    "logoFile": "nature.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Revista de Alto Impacto",
      "Genómica",
      "Translacional"
    ]
  },
  {
    "id": "springerlink",
    "title": "SpringerLink",
    "description": "Colección masiva de monografías biomédicas, manuales de protocolos de laboratorio y revistas científicas de Springer Nature con acceso a texto completo.",
    "category": "Multidisciplinaria",
    "accessType": "Suscripción URP",
    "logoFile": "springerlink.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Springer",
      "Libros Científicos",
      "Monografías"
    ]
  },
  {
    "id": "springerjournals",
    "title": "Springer Journals",
    "description": "Publicaciones periódicas científicas especializadas en cardiología, oncología, neurociencias y cirugía de la editorial Springer.",
    "category": "Revistas y Libros",
    "accessType": "Suscripción URP",
    "logoFile": "springerjournals.png",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Oncología",
      "Neurología",
      "Cardiología"
    ]
  },
  {
    "id": "ebooksdeovid",
    "title": "eBooks de Ovid (Lippincott Williams & Wilkins)",
    "description": "Colección electrónica de libros médicos canónicos de LWW, semiología médica de Bates, farmacología ilustrada de Lippincott y atlas quirúrgicos.",
    "category": "Revistas y Libros",
    "accessType": "Suscripción URP",
    "logoFile": "ebooksdeovid.jpg",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Bates Semiología",
      "LWW",
      "Atlas Quirúrgicos"
    ]
  },
  {
    "id": "revistasovid",
    "title": "Revistas Ovid (LWW)",
    "description": "Revistas médicas revisadas por pares de Lippincott Williams & Wilkins en anestesiología, ortopedia, enfermería y medicina intensiva.",
    "category": "Revistas y Libros",
    "accessType": "Suscripción URP",
    "logoFile": "revistasovid.jpg",
    "accessUrl": "https://test.urp.edu.pe/Intranet/",
    "isFeatured": false,
    "tags": [
      "Cuidados Intensivos",
      "Anestesiología",
      "LWW"
    ]
  },
  {
    "id": "pubmed",
    "title": "PubMed / MEDLINE (NCBI - NLM)",
    "description": "El motor de búsqueda bibliográfica biomédica más utilizado a nivel mundial, gestionado por la Biblioteca Nacional de Medicina de los Estados Unidos (NLM). Más de 36 millones de citas.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "pubmed.png",
    "accessUrl": "https://pubmed.ncbi.nlm.nih.gov/",
    "isFeatured": true,
    "tags": [
      "MEDLINE",
      "MeSH",
      "NLM",
      "Bibliografía Médica"
    ]
  },
  {
    "id": "pubmed-ai",
    "title": "PubMed AI Search",
    "description": "Asistente inteligente con modelos de lenguaje integrados para la síntesis rápida de evidencia y búsqueda semántica avanzada sobre la base de datos de PubMed.",
    "category": "Herramientas Clínicas",
    "accessType": "Acceso Abierto",
    "logoFile": "pubmedai.png",
    "accessUrl": "https://pubmed.ncbi.nlm.nih.gov/",
    "isFeatured": false,
    "tags": [
      "Inteligencia Artificial",
      "Búsqueda Semántica"
    ]
  },
  {
    "id": "pmc-pubmed-central",
    "title": "PubMed Central (PMC)",
    "description": "Archivo digital gratuito de artículos biomédicos y de ciencias de la vida a texto completo del Instituto Nacional de Salud (NIH) de EE. UU.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "pmc-pubmed.png",
    "accessUrl": "https://www.ncbi.nlm.nih.gov/pmc/",
    "isFeatured": false,
    "tags": [
      "Texto Completo Gratuito",
      "NIH",
      "Open Access"
    ]
  },
  {
    "id": "europe-pmc",
    "title": "Europe PMC",
    "description": "Repositorio abierto que indexa millones de artículos biomédicos, preprints, patentes y directrices clínicas de la Unión Europea y el Reino Unido.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "europepmc.png",
    "accessUrl": "https://europepmc.org/",
    "isFeatured": false,
    "tags": [
      "Europa",
      "Preprints",
      "Acceso Libre"
    ]
  },
  {
    "id": "scielo",
    "title": "SciELO (Scientific Electronic Library Online)",
    "description": "Red de bibliotecas virtuales de libre acceso líder en América Latina, España y Portugal. Cobertura completa de la producción médica y de salud pública en español.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "scielo.png",
    "accessUrl": "https://scielo.org/",
    "isFeatured": true,
    "tags": [
      "América Latina",
      "Salud Pública",
      "Español"
    ]
  },
  {
    "id": "lilacs",
    "title": "LILACS (Literatura Latinoamericana en Ciencias de la Salud)",
    "description": "El índice bibliográfico más importante de la literatura científica y técnica en salud de 26 países de América Latina y el Caribe, coordinado por BIREME/OPS/OMS.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "lilacs.png",
    "accessUrl": "https://lilacs.bvsalud.org/es/",
    "isFeatured": true,
    "tags": [
      "BIREME",
      "OPS/OMS",
      "América Latina"
    ]
  },
  {
    "id": "bvs-salud",
    "title": "Biblioteca Virtual en Salud (BVS / BIREME)",
    "description": "Portal integrador de fuentes de información científica en salud de la Organización Panamericana de la Salud (OPS/OMS) para las Américas.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "bvsalud.png",
    "accessUrl": "https://bvsalud.org/es/",
    "isFeatured": false,
    "tags": [
      "OPS",
      "OMS",
      "BVS"
    ]
  },
  {
    "id": "epistemonikos",
    "title": "Epistemonikos",
    "description": "La mayor base de datos colaborativa multilingüe de evidencia en salud. Reúne revisiones sistemáticas de alta calidad para fundamentar decisiones en salud pública y clínica.",
    "category": "Herramientas Clínicas",
    "accessType": "Acceso Abierto",
    "logoFile": "epistemonikos.png",
    "accessUrl": "https://www.epistemonikos.org/es/",
    "isFeatured": false,
    "tags": [
      "Revisiones Sistemáticas",
      "Evidencia Clínica"
    ]
  },
  {
    "id": "paho-iris",
    "title": "PAHO / OPS - Repositorio IRIS",
    "description": "Biblioteca digital oficial de la Organización Panamericana de la Salud. Guías técnicas, informes epidemiológicos, resoluciones y estadísticas sanitarias para las Américas.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "paho.png",
    "accessUrl": "https://iris.paho.org/",
    "isFeatured": false,
    "tags": [
      "OPS",
      "Epidemiología",
      "Políticas Sanitarias"
    ]
  },
  {
    "id": "repositorio-ops",
    "title": "Repositorio Institucional de la OPS",
    "description": "Publicaciones institucionales, manuales de vigilancia epidemiológica y protocolos de respuesta a brotes de la Organización Panamericana de la Salud.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "repositorioinstitucionaldelaops.png",
    "accessUrl": "https://iris.paho.org/",
    "isFeatured": false,
    "tags": [
      "Salud Panamericana",
      "Manuales Técnicos"
    ]
  },
  {
    "id": "boletines-epidemiologicos",
    "title": "Boletines Epidemiológicos (CDC / MINSA)",
    "description": "Boletines oficiales de vigilancia de enfermedades transmisibles, emergencias en salud pública y reportes de notificación obligatoria del Perú y la región.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "boletinesepidemiologicos.png",
    "accessUrl": "https://www.dge.gob.pe/portalnuevo/",
    "isFeatured": false,
    "tags": [
      "MINSA",
      "CDC Perú",
      "Vigilancia Epidemiológica"
    ]
  },
  {
    "id": "revista-medica-imss",
    "title": "Revista Médica del IMSS",
    "description": "Revista científica mexicana con investigaciones clínicas, epidemiológicas y de gestión médica en el ámbito hospitalario y de seguridad social.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "revistamedicadelimss.png",
    "accessUrl": "https://revistamedica.imss.gob.mx/",
    "isFeatured": false,
    "tags": [
      "Medicina Hospitalaria",
      "Clínica"
    ]
  },
  {
    "id": "revistas-academicas-urp",
    "title": "Revistas Académicas URP",
    "description": "Portal oficial de revistas científicas de la Universidad Ricardo Palma, incluyendo la Revista de la Facultad de Medicina Humana (RFMH - Scopus).",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "revistasacademicasurp.png",
    "accessUrl": "https://revistas.urp.edu.pe/index.php/RFMH",
    "isFeatured": true,
    "tags": [
      "URP",
      "RFMH",
      "Producción Científica Local"
    ]
  },
  {
    "id": "doaj",
    "title": "DOAJ (Directory of Open Access Journals)",
    "description": "Directorio independiente que indexa más de 20,000 revistas científicas de acceso abierto de alta calidad y revisadas por pares de todo el mundo.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "doajdirectoryofopenaccessjournal.png",
    "accessUrl": "https://doaj.org/",
    "isFeatured": false,
    "tags": [
      "Revistas Científicas",
      "Open Access"
    ]
  },
  {
    "id": "doab",
    "title": "DOAB (Directory of Open Access Books)",
    "description": "Servicio de indexación de libros académicos de acceso abierto revisados por pares para garantizar rigor científico en monografías médicas.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "doabdirectoryofopenaccessbooks.png",
    "accessUrl": "https://www.doabooks.org/",
    "isFeatured": false,
    "tags": [
      "Libros Científicos",
      "Monografías"
    ]
  },
  {
    "id": "redalyc",
    "title": "RedALyC (Red de Revistas Científicas)",
    "description": "Infraestructura global de comunicación científica de acceso abierto no comercial para revistas de Iberoamérica.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "redalyc.png",
    "accessUrl": "https://www.redalyc.org/",
    "isFeatured": false,
    "tags": [
      "Iberoamérica",
      "Open Access"
    ]
  },
  {
    "id": "plos-open-access",
    "title": "PLOS (Public Library of Science)",
    "description": "Pionera mundial en publicación científica abierta. Incluye PLOS Medicine y PLOS ONE con investigaciones rigurosas en enfermedades infecciosas y ensayos clínicos.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "plosopenaccess.png",
    "accessUrl": "https://plos.org/",
    "isFeatured": false,
    "tags": [
      "PLOS Medicine",
      "Enfermedades Infecciosas"
    ]
  },
  {
    "id": "mdpi",
    "title": "MDPI Healthcare & Medicine",
    "description": "Plataforma editorial suiza con más de 400 revistas de acceso abierto revisadas por pares en biomedicina, farmacología y salud pública.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "mdpi.png",
    "accessUrl": "https://www.mdpi.com/",
    "isFeatured": false,
    "tags": [
      "Publicaciones Abiertas",
      "Farmacología"
    ]
  },
  {
    "id": "wiley-open-access",
    "title": "Wiley Open Access",
    "description": "Colección de revistas médicas y de ciencias biológicas de la prestigiosa editorial John Wiley & Sons disponibles bajo licencia Creative Commons.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "wileyopenaccess.png",
    "accessUrl": "https://authorservices.wiley.com/open-research/open-access/browse-journals.html",
    "isFeatured": false,
    "tags": [
      "Wiley",
      "Revistas Biomédicas"
    ]
  },
  {
    "id": "springer-open",
    "title": "SpringerOpen",
    "description": "Portafolio de más de 200 revistas y libros de acceso abierto de Springer en todas las disciplinas médicas e investigación translacional.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "springeropen.png",
    "accessUrl": "https://www.springeropen.com/",
    "isFeatured": false,
    "tags": [
      "Springer",
      "Open Access"
    ]
  },
  {
    "id": "free-books-4-doctors",
    "title": "FreeBooks4Doctors",
    "description": "Directorio curado de libros de texto médicos completos y gratuitos en múltiples idiomas para médicos, residentes y estudiantes.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "freebooks4doctors.png",
    "accessUrl": "http://www.freebooks4doctors.com/",
    "isFeatured": false,
    "tags": [
      "Libros Gratuitos",
      "Textos Médicos"
    ]
  },
  {
    "id": "free-medical-journals",
    "title": "Free Medical Journals (Amedeo)",
    "description": "Plataforma dedicada a promover el acceso gratuito a más de 5,000 revistas médicas internacionales con texto completo.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "freemedicaljournals.png",
    "accessUrl": "http://www.freemedicaljournals.com/",
    "isFeatured": false,
    "tags": [
      "Revistas Libres",
      "Artículos Médicos"
    ]
  },
  {
    "id": "pepsic",
    "title": "PePSIC (Periódicos Electrónicos en Psicología)",
    "description": "Portal de revistas científicas en psicología y salud mental de América Latina y países de habla hispana y portuguesa.",
    "category": "Acceso Abierto",
    "accessType": "Acceso Abierto",
    "logoFile": "pepsic.png",
    "accessUrl": "http://pepsic.bvsalud.org/",
    "isFeatured": false,
    "tags": [
      "Salud Mental",
      "Psicología Clínica"
    ]
  },
  {
    "id": "nure-investigacion",
    "title": "NURE Investigación",
    "description": "Revista científica española especializada en la difusión del conocimiento enfermero, cuidados críticos e investigación en salud comunitaria.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "nureinvestigacion.png",
    "accessUrl": "https://www.nureinvestigacion.es/",
    "isFeatured": false,
    "tags": [
      "Cuidados",
      "Salud Comunitaria"
    ]
  },
  {
    "id": "asn-neuro",
    "title": "ASN Neuro",
    "description": "Revista médica oficial de la American Society for Neurochemistry dedicada a la neurobiología celular y molecular y patologías del sistema nervioso.",
    "category": "Revistas y Libros",
    "accessType": "Acceso Abierto",
    "logoFile": "asnneuro.png",
    "accessUrl": "https://journals.sagepub.com/home/asn",
    "isFeatured": false,
    "tags": [
      "Neuroquímica",
      "Neurobiología"
    ]
  },
  {
    "id": "unesco",
    "title": "UNESCO Open Science Portal",
    "description": "Directrices globales, bases de datos de bioética y recursos de investigación en ciencia abierta avalados por las Naciones Unidas.",
    "category": "Multidisciplinaria",
    "accessType": "Acceso Abierto",
    "logoFile": "unesco.png",
    "accessUrl": "https://en.unesco.org/science-sustainable-future/open-science",
    "isFeatured": false,
    "tags": [
      "Bioética",
      "Ciencia Abierta"
    ]
  },
  {
    "id": "idrc-crdi",
    "title": "IDRC / CRDI Digital Library",
    "description": "Biblioteca digital del Centro Internacional de Investigaciones para el Desarrollo con investigaciones globales en salud pública materna, infantil y nutrición.",
    "category": "Multidisciplinaria",
    "accessType": "Acceso Abierto",
    "logoFile": "idrc-crdi.png",
    "accessUrl": "https://idl-bnc-idrc.dspacedirect.org/",
    "isFeatured": false,
    "tags": [
      "Salud Global",
      "Nutrición",
      "Investigación"
    ]
  }
];

export const CATEGORIES: { id: DatabaseCategory; label: string; count: number }[] = [
  { id: 'Todas', label: 'Todas las Bases', count: DATABASES_DATA.length },
  { id: 'Especializada', label: 'Especializadas Medicina', count: DATABASES_DATA.filter(d => d.category === 'Especializada').length },
  { id: 'Herramientas Clínicas', label: 'Point-of-Care & Clínicas', count: DATABASES_DATA.filter(d => d.category === 'Herramientas Clínicas').length },
  { id: 'Revistas y Libros', label: 'Revistas & Libros', count: DATABASES_DATA.filter(d => d.category === 'Revistas y Libros').length },
  { id: 'Multidisciplinaria', label: 'Multidisciplinarias', count: DATABASES_DATA.filter(d => d.category === 'Multidisciplinaria').length },
  { id: 'Acceso Abierto', label: 'Acceso Abierto (Open Access)', count: DATABASES_DATA.filter(d => d.category === 'Acceso Abierto').length },
];
