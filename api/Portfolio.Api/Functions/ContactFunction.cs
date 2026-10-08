using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Portfolio.Api.Models;
using Portfolio.Api.Services.Email;
using Portfolio.Api.Services.RateLimiting;
using Portfolio.Api.Validation;

namespace Portfolio.Api.Functions;

/// <summary>POST /api/contact: validates a contact form submission and emails it to the site owner.</summary>
public sealed partial class ContactFunction(
    IEmailSender emailSender,
    IRateLimiter rateLimiter,
    ILogger<ContactFunction> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>
    /// The limit is site-wide rather than per visitor: Static Web Apps managed
    /// Functions only ever see an Azure proxy address, never the client's IP
    /// (verified on the deployed app), so per-IP limiting isn't possible here.
    /// </summary>
    internal const string RateLimitKey = "contact-form";

    [Function("Contact")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        ContactRequest? body;
        try
        {
            body = await JsonSerializer.DeserializeAsync<ContactRequest>(request.Body, JsonOptions, cancellationToken);
        }
        catch (JsonException)
        {
            body = null;
        }

        if (body is null)
            return Problem(StatusCodes.Status400BadRequest, "Invalid request", "The request body must be a JSON object.");

        // Honeypot: pretend it worked so bots don't learn to avoid the field.
        if (!string.IsNullOrWhiteSpace(body.Website))
        {
            LogHoneypot(logger);
            return Accepted();
        }

        var validation = ContactRequestValidator.Validate(body);
        if (!validation.IsValid)
        {
            return new BadRequestObjectResult(new ValidationProblemDetails(validation.Errors.ToDictionary())
            {
                Title = "Please fix the highlighted fields.",
                Status = StatusCodes.Status400BadRequest,
            });
        }

        // Only valid messages count toward the limit, so fixing a typo never locks anyone out.
        var decision = rateLimiter.TryAcquire(RateLimitKey);
        if (!decision.IsAllowed)
        {
            LogRateLimited(logger);
            var retryAfterSeconds = (int)Math.Ceiling(decision.RetryAfter.TotalSeconds);
            request.HttpContext.Response.Headers.RetryAfter = retryAfterSeconds.ToString(CultureInfo.InvariantCulture);
            return Problem(
                StatusCodes.Status429TooManyRequests,
                "Too many requests",
                "The contact form is busy right now. Please try again later or email me directly.");
        }

        var sent = await emailSender.SendContactMessageAsync(validation.Value, cancellationToken);
        if (!sent)
        {
            return Problem(
                StatusCodes.Status502BadGateway,
                "Message not sent",
                "Your message couldn't be sent right now. Please email me directly instead.");
        }

        LogSent(logger);
        return Accepted();
    }

    private static AcceptedResult Accepted() => new(location: null, value: new { message = "Thanks! Your message has been sent." });

    private static ObjectResult Problem(int status, string title, string detail) =>
        new(new ProblemDetails { Status = status, Title = title, Detail = detail }) { StatusCode = status };

    [LoggerMessage(Level = LogLevel.Information, Message = "Contact message sent")]
    private static partial void LogSent(ILogger logger);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Contact submission rejected: honeypot field was filled")]
    private static partial void LogHoneypot(ILogger logger);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Contact submission rejected: rate limit exceeded")]
    private static partial void LogRateLimited(ILogger logger);
}
