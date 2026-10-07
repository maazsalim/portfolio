using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging.Abstractions;
using Portfolio.Api.Models;
using Portfolio.Api.Options;
using Portfolio.Api.Services.Email;
using Portfolio.Api.Tests.TestDoubles;
using MsOptions = Microsoft.Extensions.Options.Options;

namespace Portfolio.Api.Tests.Email;

public class ResendEmailSenderTests
{
    private static readonly ContactMessage Message = new("Ada Lovelace", "ada@example.com", "Hello, I'd like to chat.");

    private static readonly ResendOptions ConfiguredOptions = new()
    {
        ApiKey = "re_test_key",
        From = "Portfolio <onboarding@resend.dev>",
        To = "owner@example.com",
    };

    private static ResendEmailSender CreateSender(HttpMessageHandler handler, ResendOptions? options = null) =>
        new(
            new HttpClient(handler) { BaseAddress = new Uri("https://api.resend.com/") },
            MsOptions.Create(options ?? ConfiguredOptions),
            NullLogger<ResendEmailSender>.Instance);

    [Fact]
    public async Task Posts_message_to_resend_with_api_key_and_reply_to()
    {
        var handler = StubHttpMessageHandler.Json(HttpStatusCode.OK, """{"id":"abc"}""");

        var sent = await CreateSender(handler).SendContactMessageAsync(Message, CancellationToken.None);

        Assert.True(sent);
        var request = Assert.Single(handler.Requests);
        Assert.Equal(HttpMethod.Post, request.Method);
        Assert.Equal("https://api.resend.com/emails", request.RequestUri!.ToString());
        Assert.Equal("Bearer re_test_key", request.Headers.Authorization!.ToString());

        using var body = JsonDocument.Parse(handler.RequestBodies[0]);
        var root = body.RootElement;
        Assert.Equal("Portfolio <onboarding@resend.dev>", root.GetProperty("from").GetString());
        Assert.Equal("owner@example.com", root.GetProperty("to")[0].GetString());
        Assert.Equal("ada@example.com", root.GetProperty("reply_to").GetString());
        Assert.Equal("Portfolio contact from Ada Lovelace", root.GetProperty("subject").GetString());
        Assert.Contains("Hello, I'd like to chat.", root.GetProperty("text").GetString());
    }

    [Theory]
    [InlineData(HttpStatusCode.Unauthorized)]
    [InlineData(HttpStatusCode.UnprocessableEntity)]
    [InlineData(HttpStatusCode.InternalServerError)]
    public async Task Returns_false_when_resend_rejects_the_email(HttpStatusCode status)
    {
        var handler = StubHttpMessageHandler.Json(status, """{"message":"nope"}""");

        Assert.False(await CreateSender(handler).SendContactMessageAsync(Message, CancellationToken.None));
    }

    [Fact]
    public async Task Returns_false_when_resend_is_unreachable()
    {
        var handler = StubHttpMessageHandler.Throws(new HttpRequestException("connection refused"));

        Assert.False(await CreateSender(handler).SendContactMessageAsync(Message, CancellationToken.None));
    }

    [Fact]
    public async Task Returns_false_without_calling_resend_when_not_configured()
    {
        var handler = StubHttpMessageHandler.Json(HttpStatusCode.OK, "{}");

        var sent = await CreateSender(handler, new ResendOptions()).SendContactMessageAsync(Message, CancellationToken.None);

        Assert.False(sent);
        Assert.Empty(handler.Requests);
    }
}
