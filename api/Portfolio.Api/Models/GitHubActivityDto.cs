namespace Portfolio.Api.Models;

/// <summary>Response of GET /api/github. Mirrors <c>GitHubActivity</c> in web/lib/api.ts.</summary>
public sealed record GitHubActivityDto(string ProfileUrl, IReadOnlyList<RepoSummaryDto> Repos);

public sealed record RepoSummaryDto(
    string Name,
    string? Description,
    string Url,
    string? Language,
    int Stars,
    DateTimeOffset PushedAt);
