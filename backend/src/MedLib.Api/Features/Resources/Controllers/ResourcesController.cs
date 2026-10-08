using MedLib.Api.Features.Resources.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace MedLib.Api.Features.Resources.Controllers;

[ApiController]
[Route("api/v1/resources")]
public class ResourcesController : ControllerBase
{
    private readonly MedLibDbContext _context;
    private readonly IMemoryCache _cache;

    public ResourcesController(
        MedLibDbContext context,
        IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    [HttpGet]
    public async Task<ActionResult<List<ResourceSummaryDto>>> GetAll(
        [FromQuery] string? q,
        [FromQuery] string? materia,
        [FromQuery] bool? suscripcion,
        [FromQuery] bool? hexagonos,
        [FromQuery] bool? lite,
        CancellationToken cancellationToken)
    {
        var isPlainLite = lite == true && string.IsNullOrWhiteSpace(q) && string.IsNullOrWhiteSpace(materia) && !suscripcion.HasValue && !hexagonos.HasValue;
        const string catalogCacheKey = "resources_lite_catalog";

        if (isPlainLite && _cache.TryGetValue(catalogCacheKey, out List<ResourceSummaryDto>? cachedCatalog) && cachedCatalog != null)
        {
            return Ok(cachedCatalog);
        }

        var query = _context.BasesDatosMedicas
            .AsNoTracking()
            .Where(r => r.EstadoActivo)
            .Include(r => r.RelacionesMateria)
                .ThenInclude(rm => rm.Materia)
            .AsQueryable();

        if (lite != true)
        {
            query = query.Include(r => r.Tutorial);
        }

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

        if (hexagonos.HasValue)
        {
            query = query.Where(r => r.MostrarEnHexagonos == hexagonos.Value);
        }

        var list = await query
            .OrderBy(r => r.NombreRecurso)
            .Select(r => new ResourceSummaryDto(
                r.IdBaseDatos,
                r.NombreRecurso,
                r.LogotipoUrl,
                lite == true ? "" : r.DescripcionClinica,
                r.EsSuscripcion,
                r.TieneAppMovil,
                lite == true ? null : r.UrlExterno,
                r.EstadoActivo,
                r.MostrarEnHexagonos,
                r.RelacionesMateria.Select(rm => rm.Materia.NombreMateria).OrderBy(m => m).ToList(),
                lite == true || r.Tutorial == null ? null : new TutorialDto(r.Tutorial.IdTutorial, r.Tutorial.YoutubeVideoId, r.Tutorial.GuiaPdfUrl)
            ))
            .ToListAsync(cancellationToken);

        if (isPlainLite)
        {
            _cache.Set(catalogCacheKey, list, TimeSpan.FromMinutes(10));
        }

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
                r.MostrarEnHexagonos,
                r.RelacionesMateria.Select(rm => rm.Materia.NombreMateria).OrderBy(m => m).ToList(),
                r.Tutorial != null ? new TutorialDto(r.Tutorial.IdTutorial, r.Tutorial.YoutubeVideoId, r.Tutorial.GuiaPdfUrl) : null
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (resource == null)
        {
            return NotFound(new { message = $"No se encontró el recurso médico con ID {id}." });
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
