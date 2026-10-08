using System.Net;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Portfolio.Api.Options;
using Portfolio.Api.Services.GitHub;
using Portfolio.Api.Tests.TestDoubles;
using MsOptions = Microsoft.Extensions.Options.Options;

namespace Portfolio.Api.Tests.GitHub;

public class GitHubServiceTests
{
    private const string ReposJson = """
        [
          { "name": "older", "description": "Old project", "html_url": "https://github.com/maazsalim/older", "language": "C#",
            "stargazers_count": 1, "pushed_at": "2025-01-01T00:00:00Z", "fork": false, "archived": false },
          { "name": "forked", "description": null, "html_url": "https://github.com/maazsalim/forked", "language": null,
            "stargazers_count": 0, "pushed_at": "2026-09-01T00:00:00Z", "fork": true, "archived": false },
          { "name": "archived", "description": null, "html_url": "https://github.com/maazsalim/archived", "language": null,
            "stargazers_count": 0, "pushed_at": "2026-08-01T00:00:00Z", "fork": false, "archived": true },
          { "name": "newest", "description": "Latest work", "html_url": "https://github.com/maazsalim/newest", "language": "TypeScript",
            "stargazers_count": 5, "pushed_at": "2026-10-01T00:00:00Z", "fork": false, "archived": false },
          { "name": "middle", "description": null, "html_url": "https://github.com/maazsalim/middle", "language": "Python",
            "stargazers_count": 0, "pushed_at": "2026-05-01T00:00:00Z", "fork": false, "archived": false }
        ]
        """;

    private readonly MemoryCache _cache = new(new MemoryCacheOptions());

    private GitHubService CreateService(HttpMessageHandler handler, int repoCount = 4, string username = "maazsalim") =>
        new(
            new HttpClient(handler) { BaseAddress = new Uri("https://api.github.com/") },
            _cache,
            MsOptions.Create(new GitHubOptions { Username = username, RepoCount = repoCount }),
            NullLogger<GitHubService>.Instance);

    [Fact]
    public async Task Maps_repos_to_dto_newest_first_without_forks_or_archived()
    {
        var service = CreateService(StubHttpMessageHandler.Json(HttpStatusCode.OK, ReposJson));

        var activity = await service.GetActivityAsync(CancellationToken.None);

        Assert.Equal("https://github.com/maazsalim", activity.ProfileUrl);
        Assert.Equal(["newest", "middle", "older"], activity.Repos.Select(r => r.Name));

        var newest = activity.Repos[0];
        Assert.Equal("Latest work", newest.Description);
        Assert.Equal("https://github.com/maazsalim/newest", newest.Url);
        Assert.Equal("TypeScript", newest.Language);
        Assert.Equal(5, newest.Stars);
        Assert.Equal(new DateTimeOffset(2026, 10, 1, 0, 0, 0, TimeSpan.Zero), newest.PushedAt);
    }

    [Fact]
    public async Task Limits_to_configured_repo_count()
    {
        var service = CreateService(StubHttpMessageHandler.Json(HttpStatusCode.OK, ReposJson), repoCount: 2);

        var activity = await service.GetActivityAsync(CancellationToken.None);

        Assert.Equal(2, activity.Repos.Count);
    }

    [Fact]
    public async Task Requests_the_users_repos_sorted_by_push_date()
    {
        var handler = StubHttpMessageHandler.Json(HttpStatusCode.OK, ReposJson);

        await CreateService(handler).GetActivityAsync(CancellationToken.None);

        var request = Assert.Single(handler.Requests);
        Assert.Equal(
            "https://api.github.com/users/maazsalim/repos?type=owner&sort=pushed&per_page=30",
            request.RequestUri!.ToString());
    }

    [Fact]
    public async Task Serves_cached_response_without_calling_github_again()
    {
        var handler = StubHttpMessageHandler.Json(HttpStatusCode.OK, ReposJson);
        var service = CreateService(handler);

        var first = await service.GetActivityAsync(CancellationToken.None);
        var second = await service.GetActivityAsync(CancellationToken.None);

        Assert.Single(handler.Requests);
        Assert.Same(first, second);
    }

    [Fact]
    public async Task Falls_back_to_last_good_response_when_github_fails_after_cache_expiry()
    {
        var good = await CreateService(StubHttpMessageHandler.Json(HttpStatusCode.OK, ReposJson))
            .GetActivityAsync(CancellationToken.None);
        _cache.Remove("github-activity:maazsalim"); // simulate the 1-hour entry expiring

        var activity = await CreateService(StubHttpMessageHandler.Json(HttpStatusCode.Forbidden, "{}"))
            .GetActivityAsync(CancellationToken.None);

        Assert.Same(good, activity);
    }

    [Theory]
    [InlineData(HttpStatusCode.Forbidden, "{\"message\":\"API rate limit exceeded\"}")]
    [InlineData(HttpStatusCode.NotFound, "{\"message\":\"Not Found\"}")]
    [InlineData(HttpStatusCode.OK, "this is not json")]
    public async Task Throws_unavailable_when_github_fails_and_nothing_is_cached(HttpStatusCode status, string body)
    {
        var service = CreateService(StubHttpMessageHandler.Json(status, body));

        await Assert.ThrowsAsync<GitHubUnavailableException>(() => service.GetActivityAsync(CancellationToken.None));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task Throws_unavailable_without_calling_github_when_username_is_missing(string username)
    {
        var handler = StubHttpMessageHandler.Json(HttpStatusCode.OK, ReposJson);

        await Assert.ThrowsAsync<GitHubUnavailableException>(
            () => CreateService(handler, username: username).GetActivityAsync(CancellationToken.None));
        Assert.Empty(handler.Requests);
    }

    [Fact]
    public async Task Throws_unavailable_when_github_is_unreachable()
    {
        var service = CreateService(StubHttpMessageHandler.Throws(new HttpRequestException("DNS failure")));

        await Assert.ThrowsAsync<GitHubUnavailableException>(() => service.GetActivityAsync(CancellationToken.None));
    }
}
