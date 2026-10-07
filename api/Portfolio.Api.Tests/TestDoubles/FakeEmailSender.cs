using Portfolio.Api.Models;
using Portfolio.Api.Services.Email;

namespace Portfolio.Api.Tests.TestDoubles;

public sealed class FakeEmailSender(bool succeeds = true) : IEmailSender
{
    public List<ContactMessage> Sent { get; } = [];

    public Task<bool> SendContactMessageAsync(ContactMessage message, CancellationToken cancellationToken)
    {
        if (succeeds) Sent.Add(message);
        return Task.FromResult(succeeds);
    }
}
