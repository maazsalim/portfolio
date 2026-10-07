using Portfolio.Api.Models;

namespace Portfolio.Api.Services.GitHub;

public interface IGitHubService
{
    /// <summary>Recently pushed public repos, served from cache when possible.</summary>
    /// <exception cref="GitHubUnavailableException">GitHub failed and nothing is cached.</exception>
    Task<GitHubActivityDto> GetActivityAsync(CancellationToken cancellationToken);
}

public sealed class GitHubUnavailableException(string message, Exception? inner = null) : Exception(message, inner);
