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
-- 3. TABLA: t_base_datos_biomedica (Catálogo de Recursos Científicos y Bases de Datos)
-- =============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N't_base_datos_biomedica')
BEGIN
    CREATE TABLE [dbo].[t_base_datos_biomedica] (
        [id_base_datos]         INT IDENTITY(1,1) NOT NULL,
        [nombre_recurso]        NVARCHAR(100)     NOT NULL,
        [logotipo_url]          NVARCHAR(255)     NOT NULL,
        [descripcion_clinica]   NVARCHAR(MAX)     NOT NULL,
        [es_suscripcion]        BIT               NOT NULL CONSTRAINT [DF_base_datos_suscripcion] DEFAULT (1),
        [tiene_app_movil]       BIT               NOT NULL CONSTRAINT [DF_base_datos_app_movil] DEFAULT (0),
        [url_externo]           NVARCHAR(255)     NULL,
        [estado_activo]         BIT               NOT NULL CONSTRAINT [DF_base_datos_estado] DEFAULT (1),
        [mostrar_en_hexagonos]  BIT               NOT NULL CONSTRAINT [DF_base_datos_hexagonos] DEFAULT (0),
        CONSTRAINT [PK_t_base_datos_biomedica] PRIMARY KEY CLUSTERED ([id_base_datos] ASC)
    );

    CREATE NONCLUSTERED INDEX [IX_t_base_datos_biomedica_activo]
        ON [dbo].[t_base_datos_biomedica] ([estado_activo] ASC)
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
            REFERENCES [dbo].[t_base_datos_biomedica] ([id_base_datos]) ON DELETE CASCADE,
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
            REFERENCES [dbo].[t_base_datos_biomedica] ([id_base_datos]) ON DELETE CASCADE
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
