using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Logging.Abstractions;
using Portfolio.Api.Functions;
using Portfolio.Api.Tests.TestDoubles;

namespace Portfolio.Api.Tests.Functions;

public class ContactFunctionTests
{
    private const string ValidBody = """{"name":"Ada","email":"ada@example.com","message":"Hello, I'd like to chat.","website":""}""";

    private readonly FakeEmailSender _email = new();
    private FakeRateLimiter _limiter = FakeRateLimiter.Allowing();

    private ContactFunction CreateFunction(FakeEmailSender? email = null) =>
        new(email ?? _email, _limiter, NullLogger<ContactFunction>.Instance);

    private static HttpRequest Request(string body, string clientIp = "203.0.113.7")
    {
        var context = new DefaultHttpContext();
        context.Request.Method = "POST";
        context.Request.ContentType = "application/json";
        context.Request.Headers["X-Forwarded-For"] = clientIp;
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(body));
        return context.Request;
    }

    private static int? StatusOf(IActionResult result) => Assert.IsAssignableFrom<IStatusCodeActionResult>(result).StatusCode;

    [Fact]
    public async Task Valid_message_is_sent_and_returns_202()
    {
        var result = await CreateFunction().Run(Request(ValidBody), CancellationToken.None);

        Assert.Equal(StatusCodes.Status202Accepted, StatusOf(result));
        var sent = Assert.Single(_email.Sent);
        Assert.Equal("ada@example.com", sent.Email);
    }

    [Fact]
    public async Task Rate_limit_is_shared_across_the_whole_site()
    {
        await CreateFunction().Run(Request(ValidBody, clientIp: "198.51.100.9"), CancellationToken.None);
        await CreateFunction().Run(Request(ValidBody, clientIp: "203.0.113.50"), CancellationToken.None);

        Assert.Equal([ContactFunction.RateLimitKey, ContactFunction.RateLimitKey], _limiter.Keys);
    }

    [Theory]
    [InlineData("not json")]
    [InlineData("null")]
    [InlineData("")]
    public async Task Malformed_body_returns_400(string body)
    {
        var result = await CreateFunction().Run(Request(body), CancellationToken.None);

        Assert.Equal(StatusCodes.Status400BadRequest, StatusOf(result));
        Assert.Empty(_email.Sent);
    }

    [Fact]
    public async Task Invalid_fields_return_400_with_field_errors_and_do_not_count_toward_the_limit()
    {
        var result = await CreateFunction().Run(
            Request("""{"name":"","email":"nope","message":"hi"}"""),
            CancellationToken.None);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        var problem = Assert.IsType<ValidationProblemDetails>(badRequest.Value);
        Assert.Equal(["email", "message", "name"], problem.Errors.Keys.Order());
        Assert.Empty(_limiter.Keys);
        Assert.Empty(_email.Sent);
    }

    [Fact]
    public async Task Filled_honeypot_pretends_success_but_sends_nothing()
    {
        var body = """{"name":"Bot","email":"bot@example.com","message":"Buy cheap things now!","website":"http://spam.example"}""";

        var result = await CreateFunction().Run(Request(body), CancellationToken.None);

        Assert.Equal(StatusCodes.Status202Accepted, StatusOf(result));
        Assert.Empty(_email.Sent);
        Assert.Empty(_limiter.Keys);
    }

    [Fact]
    public async Task Rate_limited_request_returns_429_with_retry_after()
    {
        _limiter = FakeRateLimiter.Rejecting(TimeSpan.FromSeconds(90.2));
        var request = Request(ValidBody);

        var result = await CreateFunction().Run(request, CancellationToken.None);

        Assert.Equal(StatusCodes.Status429TooManyRequests, StatusOf(result));
        Assert.Equal("91", request.HttpContext.Response.Headers.RetryAfter.ToString());
        Assert.Empty(_email.Sent);
    }

    [Fact]
    public async Task Email_provider_failure_returns_502()
    {
        var result = await CreateFunction(new FakeEmailSender(succeeds: false)).Run(Request(ValidBody), CancellationToken.None);

        Assert.Equal(StatusCodes.Status502BadGateway, StatusOf(result));
    }
}
