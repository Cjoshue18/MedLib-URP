using MedLib.Api.Features.Resources.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Resources.Controllers;

[ApiController]
[Route("api/v1/resources")]
public class ResourcesController : ControllerBase
{
    private readonly MedLibDbContext _context;

    public ResourcesController(MedLibDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<ResourceSummaryDto>>> GetAll(
        [FromQuery] string? q,
        [FromQuery] string? materia,
        [FromQuery] bool? suscripcion,
        CancellationToken cancellationToken)
    {
        var query = _context.BasesDatosMedicas
            .AsNoTracking()
            .Where(r => r.EstadoActivo)
            .Include(r => r.RelacionesMateria)
                .ThenInclude(rm => rm.Materia)
            .Include(r => r.Tutorial)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var cleanQuery = q.Trim().ToLower();
            query = query.Where(r => 
                r.NombreRecurso.ToLower().Contains(cleanQuery) || 
                r.DescripcionClinica.ToLower().Contains(cleanQuery));
        }

        if (!string.IsNullOrWhiteSpace(materia))
        {
            var cleanSubject = materia.Trim().ToLower();
            query = query.Where(r => r.RelacionesMateria.Any(rm => rm.Materia.NombreMateria.ToLower() == cleanSubject));
        }

        if (suscripcion.HasValue)
        {
            query = query.Where(r => r.EsSuscripcion == suscripcion.Value);
        }

        var list = await query
            .OrderBy(r => r.NombreRecurso)
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
            .ToListAsync(cancellationToken);

        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ResourceSummaryDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var resource = await _context.BasesDatosMedicas
            .AsNoTracking()
            .Where(r => r.IdBaseDatos == id && r.EstadoActivo)
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
            return NotFound(new { message = $"No se encontró el recurso biomédico con ID {id}." });
        }

        return Ok(resource);
    }

    [HttpGet("/api/v1/subjects")]
    public async Task<ActionResult<List<SubjectDto>>> GetSubjects(CancellationToken cancellationToken)
    {
        var subjects = await _context.Materias
            .AsNoTracking()
            .OrderBy(m => m.NombreMateria)
            .Select(m => new SubjectDto(m.IdMateria, m.NombreMateria))
            .ToListAsync(cancellationToken);

        return Ok(subjects);
    }
}
