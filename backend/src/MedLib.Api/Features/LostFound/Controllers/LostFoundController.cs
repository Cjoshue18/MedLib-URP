using System.Text.RegularExpressions;
using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.LostFound.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.LostFound.Controllers;

[ApiController]
[Route("api/v1/lost-items")]
public class LostFoundController : ControllerBase
{
    private readonly MedLibDbContext _context;
    private static readonly Regex InstagramUrlRegex = new(
        @"https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)",
        RegexOptions.Compiled | RegexOptions.IgnoreCase
    );

    public LostFoundController(MedLibDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<LostItemPostDto>>> GetPosts()
    {
        var posts = await _context.ObjetosPerdidosPosts
            .OrderByDescending(p => p.FechaCreacion)
            .Take(6)
            .Select(p => new LostItemPostDto(p.IdPost, p.UrlInstagram, p.FechaCreacion))
            .ToListAsync();

        return Ok(posts);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<LostItemPostDto>> CreatePost([FromBody] CreateLostItemPostRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UrlInstagram))
        {
            return BadRequest(new { message = "La URL de Instagram es obligatoria." });
        }

        var match = InstagramUrlRegex.Match(request.UrlInstagram);
        if (!match.Success)
        {
            return BadRequest(new { message = "El enlace no es una publicación válida de Instagram (ej: https://www.instagram.com/p/ABC123/)." });
        }

        var normalizedUrl = $"https://www.instagram.com/p/{match.Groups[1].Value}/";

        var count = await _context.ObjetosPerdidosPosts.CountAsync();
        if (count >= 6)
        {
            return BadRequest(new { message = "Se ha alcanzado el límite máximo de 6 publicaciones. Elimine una antes de añadir una nueva." });
        }

        var entity = new ObjetoPerdidoPost
        {
            UrlInstagram = normalizedUrl,
            FechaCreacion = DateTime.UtcNow
        };

        _context.ObjetosPerdidosPosts.Add(entity);
        await _context.SaveChangesAsync();

        var dto = new LostItemPostDto(entity.IdPost, entity.UrlInstagram, entity.FechaCreacion);
        return CreatedAtAction(nameof(GetPosts), new { id = entity.IdPost }, dto);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.ObjetosPerdidosPosts.FindAsync(id);
        if (post == null)
        {
            return NotFound(new { message = "Publicación no encontrada." });
        }

        _context.ObjetosPerdidosPosts.Remove(post);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
