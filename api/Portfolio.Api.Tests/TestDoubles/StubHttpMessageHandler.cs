using System.Net;
using System.Text;

namespace Portfolio.Api.Tests.TestDoubles;

/// <summary>Returns canned responses and records every request it receives.</summary>
public sealed class StubHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> respond) : HttpMessageHandler
{
    public List<HttpRequestMessage> Requests { get; } = [];

    /// <summary>Request bodies, captured before the request is disposed.</summary>
    public List<string> RequestBodies { get; } = [];

    public static StubHttpMessageHandler Json(HttpStatusCode status, string json) =>
        new(_ => new HttpResponseMessage(status) { Content = new StringContent(json, Encoding.UTF8, "application/json") });

    public static StubHttpMessageHandler Throws(Exception exception) => new(_ => throw exception);

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        Requests.Add(request);
        RequestBodies.Add(request.Content is null ? "" : await request.Content.ReadAsStringAsync(cancellationToken));
        return respond(request);
    }
}
