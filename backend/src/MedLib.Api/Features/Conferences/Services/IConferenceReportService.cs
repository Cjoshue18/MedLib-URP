using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.Conferences.Dtos;

namespace MedLib.Api.Features.Conferences.Services;

public interface IConferenceReportService
{
    Task AutoFinalizeExpiredConferencesAsync(CancellationToken cancellationToken = default);
    Task<ConferenceReportDto?> GenerateConferenceReportAsync(int conferenceId, CancellationToken cancellationToken = default);
    ConferenceSummaryDto MapToSummary(ConferenciaMedica conference);
}
