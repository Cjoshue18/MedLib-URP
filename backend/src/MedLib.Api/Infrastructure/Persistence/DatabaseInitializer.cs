using MedLib.Api.Features.Resources.Controllers;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static void EnsureTablesCreated(WebApplication app)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MedLibDbContext>();

            var createTablesSql = """
                CREATE TABLE IF NOT EXISTS t_conferencia_medica (
                    id_conferencia SERIAL PRIMARY KEY,
                    titulo_evento VARCHAR(150) NOT NULL,
                    expositor_ponente VARCHAR(100) NOT NULL,
                    entidad_editorial VARCHAR(100) NOT NULL,
                    fecha_hora_inicio TIMESTAMPTZ NOT NULL,
                    fecha_hora_fin TIMESTAMPTZ NOT NULL,
                    modalidad VARCHAR(20) NOT NULL DEFAULT 'Virtual',
                    enlace_virtual VARCHAR(255) NULL,
                    asistencia_abierta BOOLEAN NOT NULL DEFAULT FALSE,
                    estado_evento VARCHAR(20) NOT NULL DEFAULT 'Programada',
                    auto_purgar_30_dias BOOLEAN NOT NULL DEFAULT FALSE,
                    fecha_caducidad_purge TIMESTAMPTZ NULL,
                    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS t_inscripcion (
                    id_inscripcion SERIAL PRIMARY KEY,
                    id_conferencia INT NOT NULL REFERENCES t_conferencia_medica(id_conferencia) ON DELETE CASCADE,
                    tipo_participante VARCHAR(20) NOT NULL,
                    tipo_documento VARCHAR(20) NOT NULL,
                    numero_documento VARCHAR(20) NOT NULL,
                    nombres VARCHAR(100) NOT NULL,
                    apellidos VARCHAR(100) NOT NULL,
                    correo VARCHAR(100) NOT NULL,
                    ciclo_academico INT NULL,
                    fecha_hora_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT uq_inscripcion_conferencia_doc UNIQUE (id_conferencia, numero_documento)
                );

                CREATE TABLE IF NOT EXISTS t_asistencia (
                    id_asistencia SERIAL PRIMARY KEY,
                    id_conferencia INT NOT NULL REFERENCES t_conferencia_medica(id_conferencia) ON DELETE CASCADE,
                    tipo_participante VARCHAR(20) NOT NULL,
                    tipo_documento VARCHAR(20) NOT NULL,
                    numero_documento VARCHAR(20) NOT NULL,
                    nombres VARCHAR(100) NOT NULL,
                    apellidos VARCHAR(100) NOT NULL,
                    correo VARCHAR(100) NOT NULL,
                    ciclo_academico INT NULL,
                    fecha_hora_marcacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    es_asistencia_valida BOOLEAN NOT NULL DEFAULT TRUE,
                    CONSTRAINT uq_asistencia_conferencia_doc UNIQUE (id_conferencia, numero_documento)
                );

                CREATE TABLE IF NOT EXISTS t_objeto_perdido_post (
                    id_post SERIAL PRIMARY KEY,
                    url_instagram VARCHAR(255) NOT NULL,
                    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
                """;

            context.Database.ExecuteSqlRaw(createTablesSql);
            context.Database.ExecuteSqlRaw("ALTER TABLE t_tutorial_recurso DROP COLUMN IF EXISTS titulo_video;");

            var dirtyTutorials = context.TutorialesRecursos.ToList();
            var hasChanges = false;
            foreach (var t in dirtyTutorials)
            {
                var clean = AdminResourcesController.ExtractYouTubeVideoId(t.YoutubeVideoId);
                if (!string.IsNullOrEmpty(clean) && clean != t.YoutubeVideoId)
                {
                    t.YoutubeVideoId = clean;
                    hasChanges = true;
                }
            }
            if (hasChanges)
            {
                context.SaveChanges();
            }
        }
        catch
        {
        }
    }
}
