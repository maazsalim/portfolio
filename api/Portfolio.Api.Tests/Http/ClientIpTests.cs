using System.Net;
using Microsoft.AspNetCore.Http;
using Portfolio.Api.Http;

namespace Portfolio.Api.Tests.Http;

public class ClientIpTests
{
    private static HttpRequest Request(Dictionary<string, string>? headers = null, string? remoteIp = null)
    {
        var context = new DefaultHttpContext();
        foreach (var (name, value) in headers ?? []) context.Request.Headers[name] = value;
        if (remoteIp is not null) context.Connection.RemoteIpAddress = IPAddress.Parse(remoteIp);
        return context.Request;
    }

    [Theory]
    [InlineData("203.0.113.7", "203.0.113.7")]
    [InlineData("203.0.113.7:51234", "203.0.113.7")]
    [InlineData("203.0.113.7, 10.0.0.1", "203.0.113.7")]
    [InlineData("[2001:db8::1]:443", "2001:db8::1")]
    [InlineData("2001:db8::1", "2001:db8::1")]
    public void Reads_first_address_from_x_forwarded_for(string header, string expected)
    {
        var request = Request(new() { ["X-Forwarded-For"] = header });

        Assert.Equal(expected, ClientIp.Resolve(request));
    }

    [Fact]
    public void Prefers_app_service_client_ip_header()
    {
        var request = Request(new()
        {
            ["CLIENT-IP"] = "203.0.113.7:51234",
            ["X-Forwarded-For"] = "10.0.0.1",
        }, remoteIp: "20.205.82.199");

        Assert.Equal("203.0.113.7", ClientIp.Resolve(request));
    }

    [Fact]
    public void Prefers_platform_client_ip_headers_over_x_forwarded_for()
    {
        var request = Request(new()
        {
            ["X-Forwarded-For"] = "10.0.0.1",
            ["X-Client-IP"] = "198.51.100.2",
            ["X-Azure-ClientIP"] = "203.0.113.7",
        });

        Assert.Equal("203.0.113.7", ClientIp.Resolve(request));
    }

    [Fact]
    public void Skips_unparseable_headers()
    {
        var request = Request(new() { ["X-Client-IP"] = "garbage", ["X-Forwarded-For"] = "203.0.113.7" });

        Assert.Equal("203.0.113.7", ClientIp.Resolve(request));
    }

    [Fact]
    public void Falls_back_to_connection_address()
    {
        Assert.Equal("192.0.2.1", ClientIp.Resolve(Request(remoteIp: "192.0.2.1")));
    }

    [Fact]
    public void Returns_unknown_when_nothing_is_available()
    {
        Assert.Equal("unknown", ClientIp.Resolve(Request()));
    }
}
