using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Portfolio.Api.Services.GitHub;

namespace Portfolio.Api.Functions;

/// <summary>GET /api/github: recent public GitHub activity for the "Recent activity" section.</summary>
public sealed partial class GitHubFunction(IGitHubService gitHubService, ILogger<GitHubFunction> logger)
{
    [Function("GitHub")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "github")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var activity = await gitHubService.GetActivityAsync(cancellationToken);
            // Matches the server-side cache, so browsers don't re-ask within the hour either.
            request.HttpContext.Response.Headers.CacheControl = "public, max-age=3600";
            return new OkObjectResult(activity);
        }
        catch (GitHubUnavailableException ex)
        {
            LogUnavailable(logger, ex);
            return new ObjectResult(new ProblemDetails
            {
                Status = StatusCodes.Status502BadGateway,
                Title = "GitHub unavailable",
                Detail = "Recent activity couldn't be loaded from GitHub.",
            })
            { StatusCode = StatusCodes.Status502BadGateway };
        }
    }

    [LoggerMessage(Level = LogLevel.Error, Message = "Could not load GitHub activity")]
    private static partial void LogUnavailable(ILogger logger, Exception exception);
}
