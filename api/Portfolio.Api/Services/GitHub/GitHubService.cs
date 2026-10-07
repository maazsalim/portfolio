using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Portfolio.Api.Models;
using Portfolio.Api.Options;

namespace Portfolio.Api.Services.GitHub;

/// <summary>
/// Fetches recent repos from the GitHub REST API and trims them to a small DTO.
/// Responses are cached (default 1 hour) to stay well inside GitHub's rate limits.
/// If GitHub fails after the cache expires, the last good response is served instead.
/// </summary>
public sealed partial class GitHubService(
    HttpClient httpClient,
    IMemoryCache cache,
    IOptions<GitHubOptions> options,
    ILogger<GitHubService> logger) : IGitHubService
{
    private readonly GitHubOptions _options = options.Value;

    private string CacheKey => $"github-activity:{_options.Username}";
    private string LastGoodKey => $"github-activity-last-good:{_options.Username}";

    public async Task<GitHubActivityDto> GetActivityAsync(CancellationToken cancellationToken)
    {
        if (cache.TryGetValue(CacheKey, out GitHubActivityDto? cached) && cached is not null)
            return cached;

        try
        {
            var activity = await FetchAsync(cancellationToken);
            cache.Set(CacheKey, activity, _options.CacheDuration);
            cache.Set(LastGoodKey, activity, new MemoryCacheEntryOptions { Priority = CacheItemPriority.NeverRemove });
            return activity;
        }
        catch (Exception ex) when (
            (ex is HttpRequestException or System.Text.Json.JsonException or TaskCanceledException)
            && !cancellationToken.IsCancellationRequested)
        {
            if (cache.TryGetValue(LastGoodKey, out GitHubActivityDto? lastGood) && lastGood is not null)
            {
                LogServingStale(logger, ex);
                return lastGood;
            }

            throw new GitHubUnavailableException("GitHub activity is unavailable.", ex);
        }
    }

    private async Task<GitHubActivityDto> FetchAsync(CancellationToken cancellationToken)
    {
        var username = Uri.EscapeDataString(_options.Username);
        var repos = await httpClient.GetFromJsonAsync<List<GitHubRepoResponse>>(
            $"users/{username}/repos?type=owner&sort=pushed&per_page=30",
            cancellationToken) ?? [];

        var summaries = repos
            .Where(repo => !repo.Fork && !repo.Archived)
            .OrderByDescending(repo => repo.PushedAt)
            .Take(_options.RepoCount)
            .Select(repo => new RepoSummaryDto(
                repo.Name,
                repo.Description,
                repo.HtmlUrl,
                repo.Language,
                repo.StargazersCount,
                repo.PushedAt))
            .ToList();

        LogFetched(logger, summaries.Count, _options.Username);
        return new GitHubActivityDto($"https://github.com/{_options.Username}", summaries);
    }

    [LoggerMessage(Level = LogLevel.Information, Message = "Fetched {RepoCount} repos for {GitHubUser} from GitHub")]
    private static partial void LogFetched(ILogger logger, int repoCount, string gitHubUser);

    [LoggerMessage(Level = LogLevel.Warning, Message = "GitHub request failed; serving last known good activity")]
    private static partial void LogServingStale(ILogger logger, Exception exception);
}
