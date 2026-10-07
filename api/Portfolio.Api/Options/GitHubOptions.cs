namespace Portfolio.Api.Options;

/// <summary>Bound from the "GitHub" config section.</summary>
public sealed class GitHubOptions
{
    public const string SectionName = "GitHub";

    public string Username { get; set; } = "";

    /// <summary>Optional. Raises the GitHub rate limit from 60 to 5,000 requests/hour.</summary>
    public string? Token { get; set; }

    public int RepoCount { get; set; } = 4;

    public TimeSpan CacheDuration { get; set; } = TimeSpan.FromHours(1);
}
