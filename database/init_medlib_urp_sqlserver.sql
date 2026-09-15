-- =============================================================================
-- MedLib URP - Biblioteca Virtual y Especializada de Medicina Humana
-- Script de Creación y Estructura de Base de Datos (Microsoft SQL Server / T-SQL)
-- =============================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'medlib_urp_db')
BEGIN
    CREATE DATABASE [medlib_urp_db];
END
GO

USE [medlib_urp_db];
GO

-- =============================================================================
-- 1. TABLA: t_usuario_admin (Personal y Jefatura con Acceso al Panel de Control)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_usuario_admin')
BEGIN
    CREATE TABLE [dbo].[t_usuario_admin] (
        [id_usuario_admin] INT IDENTITY(1,1) NOT NULL,
        [username]         NVARCHAR(50)      NOT NULL,
        [password_hash]    NVARCHAR(255)     NOT NULL,
        [nombres]          NVARCHAR(100)     NOT NULL,
        [rol]              NVARCHAR(20)      NOT NULL CONSTRAINT [DF_usuario_admin_rol] DEFAULT ('Asistente'),
        [estado_activo]    BIT               NOT NULL CONSTRAINT [DF_usuario_admin_estado] DEFAULT (1),
        [fecha_creacion]   DATETIMEOFFSET    NOT NULL CONSTRAINT [DF_usuario_admin_fecha] DEFAULT (SYSDATETIMEOFFSET()),
        CONSTRAINT [PK_t_usuario_admin] PRIMARY KEY CLUSTERED ([id_usuario_admin] ASC),
        CONSTRAINT [UQ_t_usuario_admin_username] UNIQUE NONCLUSTERED ([username] ASC)
    );
END
GO

-- =============================================================================
-- 2. TABLA: t_materia (Materias / Especialidades Clínicas del Plan de Estudios)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_materia')
BEGIN
    CREATE TABLE [dbo].[t_materia] (
        [id_materia]     INT IDENTITY(1,1) NOT NULL,
        [nombre_materia] NVARCHAR(50)      NOT NULL,
        CONSTRAINT [PK_t_materia] PRIMARY KEY CLUSTERED ([id_materia] ASC),
        CONSTRAINT [UQ_t_materia_nombre] UNIQUE NONCLUSTERED ([nombre_materia] ASC)
    );
END
GO

-- =============================================================================
-- 3. TABLA: t_base_datos_medica (Catálogo de Recursos Científicos y Bases de Datos)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_base_datos_medica')
BEGIN
    CREATE TABLE [dbo].[t_base_datos_medica] (
        [id_base_datos]         INT IDENTITY(1,1) NOT NULL,
        [nombre_recurso]        NVARCHAR(100)     NOT NULL,
        [logotipo_url]          NVARCHAR(255)     NOT NULL,
        [descripcion_clinica]   NVARCHAR(MAX)     NOT NULL,
        [es_suscripcion]        BIT               NOT NULL CONSTRAINT [DF_base_datos_suscripcion] DEFAULT (1),
        [tiene_app_movil]       BIT               NOT NULL CONSTRAINT [DF_base_datos_app_movil] DEFAULT (0),
        [url_externo]           NVARCHAR(255)     NULL,
        [estado_activo]         BIT               NOT NULL CONSTRAINT [DF_base_datos_estado] DEFAULT (1),
        [mostrar_en_hexagonos]  BIT               NOT NULL CONSTRAINT [DF_base_datos_hexagonos] DEFAULT (0),
        CONSTRAINT [PK_t_base_datos_medica] PRIMARY KEY CLUSTERED ([id_base_datos] ASC)
    );

    CREATE NONCLUSTERED INDEX [IX_t_base_datos_medica_activo]
        ON [dbo].[t_base_datos_medica] ([estado_activo] ASC)
        INCLUDE ([nombre_recurso], [logotipo_url], [mostrar_en_hexagonos]);
END
GO

-- =============================================================================
-- 4. TABLA INTERMEDIA: t_base_relacion_materia (Relación N:M Bases <-> Materias)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_base_relacion_materia')
BEGIN
    CREATE TABLE [dbo].[t_base_relacion_materia] (
        [id_base_datos] INT NOT NULL,
        [id_materia]    INT NOT NULL,
        CONSTRAINT [PK_t_base_relacion_materia] PRIMARY KEY CLUSTERED ([id_base_datos] ASC, [id_materia] ASC),
        CONSTRAINT [FK_relacion_base_datos] FOREIGN KEY ([id_base_datos]) 
            REFERENCES [dbo].[t_base_datos_medica] ([id_base_datos]) ON DELETE CASCADE,
        CONSTRAINT [FK_relacion_materia] FOREIGN KEY ([id_materia]) 
            REFERENCES [dbo].[t_materia] ([id_materia]) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX [IX_t_base_relacion_materia_materia]
        ON [dbo].[t_base_relacion_materia] ([id_materia] ASC);
END
GO

-- =============================================================================
-- 5. TABLA: t_tutorial_recurso (Video Tutoriales Oficiales 1:1 con Bases de Datos)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_tutorial_recurso')
BEGIN
    CREATE TABLE [dbo].[t_tutorial_recurso] (
        [id_tutorial]       INT IDENTITY(1,1) NOT NULL,
        [id_base_datos]     INT               NOT NULL,
        [titulo_video]      NVARCHAR(150)     NOT NULL,
        [youtube_video_id]  NVARCHAR(20)      NOT NULL,
        [guia_pdf_url]      NVARCHAR(255)     NULL,
        CONSTRAINT [PK_t_tutorial_recurso] PRIMARY KEY CLUSTERED ([id_tutorial] ASC),
        CONSTRAINT [UQ_t_tutorial_base_datos] UNIQUE NONCLUSTERED ([id_base_datos] ASC),
        CONSTRAINT [FK_tutorial_base_datos] FOREIGN KEY ([id_base_datos]) 
            REFERENCES [dbo].[t_base_datos_medica] ([id_base_datos]) ON DELETE CASCADE
    );
END
GO

-- =============================================================================
-- 6. TABLA: t_refresh_token (Seguridad de Sesiones y Rotación RTR)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_refresh_token')
BEGIN
    CREATE TABLE [dbo].[t_refresh_token] (
        [id_refresh_token]            INT IDENTITY(1,1) NOT NULL,
        [id_usuario_admin]            INT               NOT NULL,
        [family_id]                   UNIQUEIDENTIFIER  NOT NULL,
        [token_hash]                  NVARCHAR(255)     NOT NULL,
        [fecha_expiracion]            DATETIMEOFFSET    NOT NULL,
        [fecha_creacion]              DATETIMEOFFSET    NOT NULL CONSTRAINT [DF_refresh_token_fecha_creacion] DEFAULT (SYSDATETIMEOFFSET()),
        [creado_por_ip]               NVARCHAR(50)      NULL,
        [user_agent]                  NVARCHAR(255)     NULL,
        [revocado]                    BIT               NOT NULL CONSTRAINT [DF_refresh_token_revocado] DEFAULT (0),
        [fecha_revocacion]            DATETIMEOFFSET    NULL,
        [reemplazado_por_token_hash]  NVARCHAR(255)     NULL,
        [motivo_revocacion]           NVARCHAR(100)     NULL,
        CONSTRAINT [PK_t_refresh_token] PRIMARY KEY CLUSTERED ([id_refresh_token] ASC),
        CONSTRAINT [FK_refresh_token_usuario] FOREIGN KEY ([id_usuario_admin]) 
            REFERENCES [dbo].[t_usuario_admin] ([id_usuario_admin]) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX [IX_t_refresh_token_hash]
        ON [dbo].[t_refresh_token] ([token_hash] ASC);

    CREATE NONCLUSTERED INDEX [IX_t_refresh_token_family]
        ON [dbo].[t_refresh_token] ([family_id] ASC);

    CREATE NONCLUSTERED INDEX [IX_t_refresh_token_usuario]
        ON [dbo].[t_refresh_token] ([id_usuario_admin] ASC);
END
GO

-- =============================================================================
-- 7. DATOS SEMILLA INICIALES (SEED DATA)
-- =============================================================================

-- Administrador de Biblioteca Inicial (Contraseña: AdminFamurp2026!)
IF NOT EXISTS (SELECT 1 FROM [dbo].[t_usuario_admin] WHERE [username] = 'admin_famurp')
BEGIN
    INSERT INTO [dbo].[t_usuario_admin] ([username], [password_hash], [nombres], [rol], [estado_activo])
    VALUES (
        'admin_famurp',
        '$2a$11$XbqFeEFRfcd.yZidQb1QeevFCIJJcXK/bHPnG748mu2LfZtcHkXjW',
        'Jefatura de Biblioteca FAMURP',
        'Jefatura',
        1
    );
END
GO

-- Materias Médicas del Plan de Estudios
IF NOT EXISTS (SELECT 1 FROM [dbo].[t_materia] WHERE [nombre_materia] = 'Medicina General')
BEGIN
    INSERT INTO [dbo].[t_materia] ([nombre_materia]) VALUES
        ('Medicina General'),
        ('Farmacología'),
        ('Anatomía Humana'),
        ('Fisiología Médica'),
        ('Patología Clínica'),
        ('Pediatría'),
        ('Ginecología y Obstetricia'),
        ('Cirugía General'),
        ('Medicina Interna'),
        ('Cardiología'),
        ('Neurología'),
        ('Salud Pública y Epidemiología');
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 't_objeto_perdido_post')
BEGIN
    CREATE TABLE t_objeto_perdido_post (
        id_post INT IDENTITY(1,1) PRIMARY KEY,
        url_instagram NVARCHAR(255) NOT NULL,
        fecha_creacion DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END
GO

-- =============================================================================
-- 6. TABLA: t_conferencia_medica (Conferencias y Capacitaciones ALFIN)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_conferencia_medica')
BEGIN
    CREATE TABLE [dbo].[t_conferencia_medica] (
        [id_conferencia]        INT IDENTITY(1,1) NOT NULL,
        [titulo_evento]         NVARCHAR(150)     NOT NULL,
        [expositor_ponente]     NVARCHAR(100)     NOT NULL,
        [entidad_editorial]     NVARCHAR(100)     NOT NULL,
        [fecha_hora_inicio]     DATETIME2         NOT NULL,
        [fecha_hora_fin]        DATETIME2         NOT NULL,
        [modalidad]             NVARCHAR(20)      NOT NULL CONSTRAINT [DF_conferencia_modalidad] DEFAULT ('Virtual'),
        [enlace_virtual]        NVARCHAR(255)     NULL,
        [asistencia_abierta]    BIT               NOT NULL CONSTRAINT [DF_conferencia_asistencia] DEFAULT (0),
        [estado_evento]         NVARCHAR(20)      NOT NULL CONSTRAINT [DF_conferencia_estado] DEFAULT ('Programada'),
        [auto_purgar_30_dias]   BIT               NOT NULL CONSTRAINT [DF_conferencia_auto_purge] DEFAULT (1),
        [fecha_caducidad_purge] DATETIME2         NULL,
        [fecha_creacion]        DATETIMEOFFSET    NOT NULL CONSTRAINT [DF_conferencia_fecha_creacion] DEFAULT (SYSDATETIMEOFFSET()),
        CONSTRAINT [PK_t_conferencia_medica] PRIMARY KEY CLUSTERED ([id_conferencia] ASC)
    );
END
GO

-- =============================================================================
-- 7. TABLA: t_inscripcion (Pre-inscripciones Web a Conferencias)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_inscripcion')
BEGIN
    CREATE TABLE [dbo].[t_inscripcion] (
        [id_inscripcion]      INT IDENTITY(1,1) NOT NULL,
        [id_conferencia]      INT               NOT NULL,
        [tipo_participante]   NVARCHAR(20)      NOT NULL,
        [tipo_documento]      NVARCHAR(20)      NOT NULL,
        [numero_documento]    NVARCHAR(20)      NOT NULL,
        [nombres]             NVARCHAR(100)     NOT NULL,
        [apellidos]           NVARCHAR(100)     NOT NULL,
        [correo]              NVARCHAR(100)     NOT NULL,
        [ciclo_academico]     INT               NULL,
        [fecha_hora_registro] DATETIMEOFFSET    NOT NULL CONSTRAINT [DF_inscripcion_fecha] DEFAULT (SYSDATETIMEOFFSET()),
        CONSTRAINT [PK_t_inscripcion] PRIMARY KEY CLUSTERED ([id_inscripcion] ASC),
        CONSTRAINT [FK_t_inscripcion_conferencia] FOREIGN KEY ([id_conferencia])
            REFERENCES [dbo].[t_conferencia_medica] ([id_conferencia])
            ON DELETE CASCADE,
        CONSTRAINT [UQ_inscripcion_conferencia_doc] UNIQUE NONCLUSTERED ([id_conferencia] ASC, [numero_documento] ASC)
    );
END
GO

-- =============================================================================
-- 8. TABLA: t_asistencia (Marcación de Asistencia en Sesión Activa Teams)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_asistencia')
BEGIN
    CREATE TABLE [dbo].[t_asistencia] (
        [id_asistencia]        INT IDENTITY(1,1) NOT NULL,
        [id_conferencia]       INT               NOT NULL,
        [tipo_participante]    NVARCHAR(20)      NOT NULL,
        [tipo_documento]       NVARCHAR(20)      NOT NULL,
        [numero_documento]     NVARCHAR(20)      NOT NULL,
        [nombres]              NVARCHAR(100)     NOT NULL,
        [apellidos]            NVARCHAR(100)     NOT NULL,
        [correo]               NVARCHAR(100)     NOT NULL,
        [ciclo_academico]      INT               NULL,
        [fecha_hora_marcacion] DATETIMEOFFSET    NOT NULL CONSTRAINT [DF_asistencia_fecha] DEFAULT (SYSDATETIMEOFFSET()),
        [es_asistencia_valida] BIT               NOT NULL CONSTRAINT [DF_asistencia_valida] DEFAULT (1),
        CONSTRAINT [PK_t_asistencia] PRIMARY KEY CLUSTERED ([id_asistencia] ASC),
        CONSTRAINT [FK_t_asistencia_conferencia] FOREIGN KEY ([id_conferencia])
            REFERENCES [dbo].[t_conferencia_medica] ([id_conferencia])
            ON DELETE CASCADE,
        CONSTRAINT [UQ_asistencia_conferencia_doc] UNIQUE NONCLUSTERED ([id_conferencia] ASC, [numero_documento] ASC)
    );
END
GO

-- =============================================================================
-- 9. TABLA: t_suscriptor_boletin (Suscripciones al Boletín y Novedades ALFIN)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_suscriptor_boletin')
BEGIN
    CREATE TABLE [dbo].[t_suscriptor_boletin] (
        [id_suscriptor]         INT IDENTITY(1,1) NOT NULL,
        [correo_institucional]  NVARCHAR(120)     NOT NULL,
        [nivel_academico]       NVARCHAR(20)      NOT NULL,
        [fecha_suscripcion]     DATETIMEOFFSET    NOT NULL CONSTRAINT [DF_suscriptor_fecha] DEFAULT (SYSDATETIMEOFFSET()),
        [estado_activo]         BIT               NOT NULL CONSTRAINT [DF_suscriptor_activo] DEFAULT (1),
        CONSTRAINT [PK_t_suscriptor_boletin] PRIMARY KEY CLUSTERED ([id_suscriptor] ASC),
        CONSTRAINT [UQ_suscriptor_correo] UNIQUE NONCLUSTERED ([correo_institucional] ASC)
    );
END
GO


