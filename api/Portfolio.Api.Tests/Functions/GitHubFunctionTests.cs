using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Portfolio.Api.Functions;
using Portfolio.Api.Models;
using Portfolio.Api.Services.GitHub;

namespace Portfolio.Api.Tests.Functions;

public class GitHubFunctionTests
{
    private sealed class StubGitHubService(Func<GitHubActivityDto> get) : IGitHubService
    {
        public Task<GitHubActivityDto> GetActivityAsync(CancellationToken cancellationToken) => Task.FromResult(get());
    }

    private static readonly GitHubActivityDto Activity = new(
        "https://github.com/maazsalim",
        [new RepoSummaryDto("portfolio", null, "https://github.com/maazsalim/portfolio", "C#", 0, DateTimeOffset.UnixEpoch)]);

    [Fact]
    public async Task Returns_activity_with_cache_header()
    {
        var request = new DefaultHttpContext().Request;
        var function = new GitHubFunction(new StubGitHubService(() => Activity), NullLogger<GitHubFunction>.Instance);

        var result = await function.Run(request, CancellationToken.None);

        Assert.Same(Activity, Assert.IsType<OkObjectResult>(result).Value);
        Assert.Equal("public, max-age=3600", request.HttpContext.Response.Headers.CacheControl.ToString());
    }

    [Fact]
    public async Task Returns_502_when_github_is_unavailable()
    {
        var request = new DefaultHttpContext().Request;
        var function = new GitHubFunction(
            new StubGitHubService(() => throw new GitHubUnavailableException("down")),
            NullLogger<GitHubFunction>.Instance);

        var result = await function.Run(request, CancellationToken.None);

        Assert.Equal(StatusCodes.Status502BadGateway, Assert.IsType<ObjectResult>(result).StatusCode);
        Assert.True(string.IsNullOrEmpty(request.HttpContext.Response.Headers.CacheControl));
    }
}
