using Portfolio.Api.Models;

namespace Portfolio.Api.Services.Email;

public interface IEmailSender
{
    /// <summary>Delivers a contact message to the site owner.</summary>
    /// <returns>True if the provider accepted the message.</returns>
    Task<bool> SendContactMessageAsync(ContactMessage message, CancellationToken cancellationToken);
}
