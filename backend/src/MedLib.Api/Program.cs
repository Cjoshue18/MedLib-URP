using System.Text;
using MedLib.Api.Common.Interfaces;
using MedLib.Api.Common.Security;
using MedLib.Api.Features.Conferences.Services;
using MedLib.Api.Infrastructure.Persistence;
using MedLib.Api.Infrastructure.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

LoadDotEnv();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();

var rawConnection = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

var connectionString = NormalizePostgresConnectionString(rawConnection);

builder.Services.AddDbContext<MedLibDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddHostedService<ConferenceLifecycleBackgroundService>();

var storageProvider = Environment.GetEnvironmentVariable("STORAGE_PROVIDER")
    ?? builder.Configuration["Storage:Provider"] 
    ?? "Cloud";
if (storageProvider.Equals("Local", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
}
else
{
    builder.Services.AddScoped<IFileStorageService, CloudFileStorageService>();
}

var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ?? builder.Configuration["Jwt:SecretKey"]
    ?? throw new InvalidOperationException("Jwt:SecretKey configuration is missing.");
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
    ?? builder.Configuration["Jwt:Issuer"] 
    ?? "MedLibUrp";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
    ?? builder.Configuration["Jwt:Audience"] 
    ?? "MedLibUrpApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

const string corsPolicyName = "MedLibCorsPolicy";
var customOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        if (customOrigins != null && customOrigins.Length > 0)
        {
            policy.WithOrigins(customOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
        else
        {
            policy.SetIsOriginAllowed(_ => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(corsPolicyName);
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new
{
    status = "Healthy",
    service = "MedLib URP API (.NET 10 LTS)",
    version = "1.0.0",
    serverTime = DateTime.UtcNow
}));

app.MapControllers();

EnsureTablesCreated(app);

app.Run();

static void EnsureTablesCreated(WebApplication app)
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
                auto_purgar_30_dias BOOLEAN NOT NULL DEFAULT TRUE,
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

        var dirtyTutorials = context.TutorialesRecursos.ToList();
        var hasChanges = false;
        foreach (var t in dirtyTutorials)
        {
            var clean = MedLib.Api.Features.Resources.Controllers.AdminResourcesController.ExtractYouTubeVideoId(t.YoutubeVideoId);
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

static string NormalizePostgresConnectionString(string connection)
{
    if (connection.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
        connection.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        var uri = new Uri(connection);
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "";
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var database = uri.AbsolutePath.TrimStart('/');
        var port = uri.Port > 0 ? uri.Port : 5432;

        return $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
    }

    return connection;
}

static void LoadDotEnv()
{
    var searchDirs = new List<DirectoryInfo?>
    {
        new DirectoryInfo(Directory.GetCurrentDirectory()),
        new DirectoryInfo(AppContext.BaseDirectory)
    };

    foreach (var startDir in searchDirs)
    {
        var current = startDir;
        while (current != null)
        {
            var envPath = Path.Combine(current.FullName, ".env");
            if (File.Exists(envPath))
            {
                ApplyEnvFile(envPath);
                return;
            }

            var repoEnv = Path.Combine(current.FullName, "repo", "MedLib-URP", ".env");
            if (File.Exists(repoEnv))
            {
                ApplyEnvFile(repoEnv);
                return;
            }

            current = current.Parent;
        }
    }
}

static void ApplyEnvFile(string path)
{
    foreach (var line in File.ReadAllLines(path))
    {
        var trimmed = line.Trim();
        if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("#")) continue;
        var parts = trimmed.Split('=', 2);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var val = parts[1].Trim().Trim('"', '\'');
            Environment.SetEnvironmentVariable(key, val);
        }
    }
}
