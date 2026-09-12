using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using MedLib.Api.Common.Interfaces;

namespace MedLib.Api.Infrastructure.Storage;

public class CloudFileStorageService : IFileStorageService
{
    private readonly IConfiguration _configuration;
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _serviceUrl;

    public CloudFileStorageService(IConfiguration configuration)
    {
        _configuration = configuration;
        _serviceUrl = Environment.GetEnvironmentVariable("STORAGE_SERVICE_URL")
            ?? Environment.GetEnvironmentVariable("AWS_ENDPOINT_URL_S3")
            ?? _configuration["Storage:ServiceUrl"] 
            ?? string.Empty;
        _bucketName = Environment.GetEnvironmentVariable("STORAGE_BUCKET_NAME")
            ?? Environment.GetEnvironmentVariable("S3_BUCKET")
            ?? _configuration["Storage:BucketName"] 
            ?? "imagenes-logos";

        var accessKey = Environment.GetEnvironmentVariable("STORAGE_ACCESS_KEY")
            ?? Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID")
            ?? _configuration["Storage:AccessKey"] 
            ?? string.Empty;
        var secretKey = Environment.GetEnvironmentVariable("STORAGE_SECRET_KEY")
            ?? Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")
            ?? _configuration["Storage:SecretKey"] 
            ?? string.Empty;
        var region = Environment.GetEnvironmentVariable("STORAGE_REGION")
            ?? Environment.GetEnvironmentVariable("AWS_REGION")
            ?? _configuration["Storage:Region"] 
            ?? "us-east-2";

        var config = new AmazonS3Config
        {
            ServiceURL = _serviceUrl,
            ForcePathStyle = true,
            AuthenticationRegion = region
        };

        var credentials = new BasicAWSCredentials(accessKey, secretKey);
        _s3Client = new AmazonS3Client(credentials, config);
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var sanitizedFileName = Path.GetFileName(fileName);
        var uniqueFileName = $"{Guid.NewGuid():N}_{sanitizedFileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = uniqueFileName,
            InputStream = fileStream,
            ContentType = contentType
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return $"{_serviceUrl.TrimEnd('/')}/{_bucketName}/{uniqueFileName}";
    }

    public async Task DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return;

        var uri = new Uri(fileUrl);
        var key = Path.GetFileName(uri.LocalPath);

        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = key
        };

        await _s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);
    }
}
