using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Portfolio.Api.Models;
using Portfolio.Api.Options;

namespace Portfolio.Api.Services.Email;

/// <summary>Sends email through the Resend REST API (https://resend.com/docs/api-reference/emails/send-email).</summary>
public sealed partial class ResendEmailSender(
    HttpClient httpClient,
    IOptions<ResendOptions> options,
    ILogger<ResendEmailSender> logger) : IEmailSender
{
    private readonly ResendOptions _options = options.Value;

    public async Task<bool> SendContactMessageAsync(ContactMessage message, CancellationToken cancellationToken)
    {
        if (!_options.IsConfigured)
        {
            LogNotConfigured(logger);
            return false;
        }

        var payload = new ResendEmail(
            From: _options.From,
            To: [_options.To],
            ReplyTo: message.Email,
            Subject: $"Portfolio contact from {message.Name}",
            Text: $"Name: {message.Name}\nEmail: {message.Email}\n\n{message.Message}");

        using var request = new HttpRequestMessage(HttpMethod.Post, "emails")
        {
            Content = JsonContent.Create(payload),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        try
        {
            using var response = await httpClient.SendAsync(request, cancellationToken);
            if (response.IsSuccessStatusCode) return true;

            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            LogProviderRejected(logger, (int)response.StatusCode, body);
            return false;
        }
        catch (HttpRequestException ex)
        {
            LogProviderUnreachable(logger, ex);
            return false;
        }
    }

    private sealed record ResendEmail(
        [property: JsonPropertyName("from")] string From,
        [property: JsonPropertyName("to")] string[] To,
        [property: JsonPropertyName("reply_to")] string ReplyTo,
        [property: JsonPropertyName("subject")] string Subject,
        [property: JsonPropertyName("text")] string Text);

    [LoggerMessage(Level = LogLevel.Error, Message = "Resend is not configured. Set Resend__ApiKey, Resend__From and Resend__To.")]
    private static partial void LogNotConfigured(ILogger logger);

    [LoggerMessage(Level = LogLevel.Error, Message = "Resend rejected the email with status {StatusCode}: {ResponseBody}")]
    private static partial void LogProviderRejected(ILogger logger, int statusCode, string responseBody);

    [LoggerMessage(Level = LogLevel.Error, Message = "Could not reach Resend")]
    private static partial void LogProviderUnreachable(ILogger logger, Exception exception);
}
