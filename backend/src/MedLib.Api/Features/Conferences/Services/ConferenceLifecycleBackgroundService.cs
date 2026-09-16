using MedLib.Api.Features.Conferences.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace MedLib.Api.Features.Conferences.Services;

public class ConferenceLifecycleBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ConferenceLifecycleBackgroundService> _logger;

    public ConferenceLifecycleBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<ConferenceLifecycleBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var reportService = scope.ServiceProvider.GetRequiredService<IConferenceReportService>();
                await reportService.AutoFinalizeExpiredConferencesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while auto-finalizing expired conferences.");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
