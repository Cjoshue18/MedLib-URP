using MedLib.Api.Common.Interfaces;

namespace MedLib.Api.Infrastructure.Storage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _storageFolder;

    public LocalFileStorageService(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
    {
        _environment = environment;
        _httpContextAccessor = httpContextAccessor;
        _storageFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "storage", "logos");

        if (!Directory.Exists(_storageFolder))
        {
            Directory.CreateDirectory(_storageFolder);
        }
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var sanitizedFileName = Path.GetFileName(fileName);
        var uniqueFileName = $"{Guid.NewGuid():N}_{sanitizedFileName}";
        var destinationPath = Path.Combine(_storageFolder, uniqueFileName);

        await using (var output = new FileStream(destinationPath, FileMode.Create))
        {
            await fileStream.CopyToAsync(output, cancellationToken);
        }

        var request = _httpContextAccessor.HttpContext?.Request;
        var baseUrl = request != null 
            ? $"{request.Scheme}://{request.Host}" 
            : "";

        return $"{baseUrl}/storage/logos/{uniqueFileName}";
    }

    public Task DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return Task.CompletedTask;

        var fileName = Path.GetFileName(fileUrl);
        var filePath = Path.Combine(_storageFolder, fileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        return Task.CompletedTask;
    }
}
