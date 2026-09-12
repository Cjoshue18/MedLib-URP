using MedLib.Api.Common.Interfaces;
using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.Resources.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Resources.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/admin/resources")]
public class AdminResourcesController : ControllerBase
{
    private readonly MedLibDbContext _context;
    private readonly IFileStorageService _storageService;

    public AdminResourcesController(MedLibDbContext context, IFileStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }

    [HttpPost]
    public async Task<ActionResult<ResourceSummaryDto>> Create(
        [FromBody] CreateResourceRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "El nombre del recurso es obligatorio." });
        }

        var database = new BaseDatosMedica
        {
            NombreRecurso = request.Name.Trim(),
            LogotipoUrl = request.LogoUrl.Trim(),
            DescripcionClinica = request.ClinicalDescription.Trim(),
            EsSuscripcion = request.IsSubscription,
            TieneAppMovil = request.HasMobileApp,
            UrlExterno = request.IsSubscription ? null : request.ExternalUrl?.Trim(),
            EstadoActivo = true
        };

        _context.BasesDatosMedicas.Add(database);
        await _context.SaveChangesAsync(cancellationToken);

        if (request.Subjects.Count > 0)
        {
            await SyncSubjectsAsync(database.IdBaseDatos, request.Subjects, cancellationToken);
        }

        if (!string.IsNullOrWhiteSpace(request.YoutubeVideoId))
        {
            var tutorial = new TutorialRecurso
            {
                IdBaseDatos = database.IdBaseDatos,
                TituloVideo = string.IsNullOrWhiteSpace(request.VideoTitle)
                    ? $"Tutorial y Búsqueda: {database.NombreRecurso}"
                    : request.VideoTitle.Trim(),
                YoutubeVideoId = request.YoutubeVideoId.Trim(),
                GuiaPdfUrl = request.GuidePdfUrl?.Trim()
            };
            _context.TutorialesRecursos.Add(tutorial);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return await GetResourceByIdInternal(database.IdBaseDatos, cancellationToken);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ResourceSummaryDto>> Update(
        int id,
        [FromBody] UpdateResourceRequest request,
        CancellationToken cancellationToken)
    {
        var database = await _context.BasesDatosMedicas
            .Include(d => d.Tutorial)
            .FirstOrDefaultAsync(d => d.IdBaseDatos == id, cancellationToken);

        if (database == null)
        {
            return NotFound(new { message = $"Recurso con ID {id} no encontrado." });
        }

        database.NombreRecurso = request.Name.Trim();
        database.LogotipoUrl = request.LogoUrl.Trim();
        database.DescripcionClinica = request.ClinicalDescription.Trim();
        database.EsSuscripcion = request.IsSubscription;
        database.TieneAppMovil = request.HasMobileApp;
        database.UrlExterno = request.IsSubscription ? null : request.ExternalUrl?.Trim();
        database.EstadoActivo = request.IsActive;

        await SyncSubjectsAsync(database.IdBaseDatos, request.Subjects, cancellationToken);

        if (!string.IsNullOrWhiteSpace(request.YoutubeVideoId))
        {
            if (database.Tutorial == null)
            {
                database.Tutorial = new TutorialRecurso
                {
                    IdBaseDatos = database.IdBaseDatos,
                    TituloVideo = string.IsNullOrWhiteSpace(request.VideoTitle)
                        ? $"Tutorial y Búsqueda: {database.NombreRecurso}"
                        : request.VideoTitle.Trim(),
                    YoutubeVideoId = request.YoutubeVideoId.Trim(),
                    GuiaPdfUrl = request.GuidePdfUrl?.Trim()
                };
            }
            else
            {
                database.Tutorial.YoutubeVideoId = request.YoutubeVideoId.Trim();
                database.Tutorial.TituloVideo = string.IsNullOrWhiteSpace(request.VideoTitle)
                    ? $"Tutorial y Búsqueda: {database.NombreRecurso}"
                    : request.VideoTitle.Trim();
                database.Tutorial.GuiaPdfUrl = request.GuidePdfUrl?.Trim();
            }
        }
        else if (database.Tutorial != null)
        {
            _context.TutorialesRecursos.Remove(database.Tutorial);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return await GetResourceByIdInternal(database.IdBaseDatos, cancellationToken);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var database = await _context.BasesDatosMedicas.FindAsync(new object[] { id }, cancellationToken);
        if (database == null)
        {
            return NotFound(new { message = $"Recurso con ID {id} no encontrado." });
        }

        database.EstadoActivo = false;
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPost("upload-logo")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<UploadLogoResponse>> UploadLogo(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "El archivo de imagen es requerido." });
        }

        var allowedExtensions = new[] { ".webp", ".png", ".jpg", ".jpeg", ".svg" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Formato no permitido. Use .webp, .png, .jpg o .svg." });
        }

        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "La imagen supera el límite permitido de 5 MB." });
        }

        await using var stream = file.OpenReadStream();
        var contentType = file.ContentType ?? "image/webp";
        var uploadedUrl = await _storageService.UploadFileAsync(stream, file.FileName, contentType, cancellationToken);

        return Ok(new UploadLogoResponse(uploadedUrl));
    }

    private async Task SyncSubjectsAsync(int databaseId, List<string> subjectNames, CancellationToken cancellationToken)
    {
        var existingRelations = await _context.BasesRelacionesMaterias
            .Where(rm => rm.IdBaseDatos == databaseId)
            .ToListAsync(cancellationToken);

        _context.BasesRelacionesMaterias.RemoveRange(existingRelations);

        var distinctSubjects = subjectNames
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s.Trim())
            .Distinct()
            .ToList();

        foreach (var subjectName in distinctSubjects)
        {
            var subject = await _context.Materias
                .FirstOrDefaultAsync(m => m.NombreMateria.ToLower() == subjectName.ToLower(), cancellationToken);

            if (subject == null)
            {
                subject = new Materia { NombreMateria = subjectName };
                _context.Materias.Add(subject);
                await _context.SaveChangesAsync(cancellationToken);
            }

            _context.BasesRelacionesMaterias.Add(new BaseRelacionMateria
            {
                IdBaseDatos = databaseId,
                IdMateria = subject.IdMateria
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<ActionResult<ResourceSummaryDto>> GetResourceByIdInternal(int id, CancellationToken cancellationToken)
    {
        var resource = await _context.BasesDatosMedicas
            .AsNoTracking()
            .Where(r => r.IdBaseDatos == id)
            .Include(r => r.RelacionesMateria)
                .ThenInclude(rm => rm.Materia)
            .Include(r => r.Tutorial)
            .Select(r => new ResourceSummaryDto(
                r.IdBaseDatos,
                r.NombreRecurso,
                r.LogotipoUrl,
                r.DescripcionClinica,
                r.EsSuscripcion,
                r.TieneAppMovil,
                r.UrlExterno,
                r.EstadoActivo,
                r.RelacionesMateria.Select(rm => rm.Materia.NombreMateria).OrderBy(m => m).ToList(),
                r.Tutorial != null ? new TutorialDto(r.Tutorial.IdTutorial, r.Tutorial.TituloVideo, r.Tutorial.YoutubeVideoId, r.Tutorial.GuiaPdfUrl) : null
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (resource == null)
        {
            return NotFound();
        }

        return Ok(resource);
    }
}
