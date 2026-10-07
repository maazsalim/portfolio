using System.Text.Json.Serialization;

namespace Portfolio.Api.Services.GitHub;

/// <summary>The fields we use from GitHub's "list repositories for a user" response.</summary>
internal sealed record GitHubRepoResponse(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("html_url")] string HtmlUrl,
    [property: JsonPropertyName("language")] string? Language,
    [property: JsonPropertyName("stargazers_count")] int StargazersCount,
    [property: JsonPropertyName("pushed_at")] DateTimeOffset PushedAt,
    [property: JsonPropertyName("fork")] bool Fork,
    [property: JsonPropertyName("archived")] bool Archived);
