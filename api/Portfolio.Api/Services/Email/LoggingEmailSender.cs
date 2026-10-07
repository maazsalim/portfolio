using Microsoft.Extensions.Logging;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services.Email;

/// <summary>
/// Local-development stand-in used when no Resend key is configured: logs the
/// message instead of sending it, so the contact form works end to end offline.
/// Never registered outside the Development environment.
/// </summary>
public sealed partial class LoggingEmailSender(ILogger<LoggingEmailSender> logger) : IEmailSender
{
    public Task<bool> SendContactMessageAsync(ContactMessage message, CancellationToken cancellationToken)
    {
        LogMessage(logger, message.Name, message.Email, message.Message);
        return Task.FromResult(true);
    }

    [LoggerMessage(Level = LogLevel.Warning, Message = "[dev] Email not sent (no Resend key). From {Name} <{Email}>: {Message}")]
    private static partial void LogMessage(ILogger logger, string name, string email, string message);
}
