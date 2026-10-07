using System.Net;
using Microsoft.AspNetCore.Http;

namespace Portfolio.Api.Http;

public static class ClientIp
{
    /// <summary>
    /// Headers that may carry the original client address, most specific first.
    /// The Functions host rewrites X-Forwarded-For before it reaches this isolated
    /// worker, so platform headers that pass through untouched are checked first.
    /// </summary>
    private static readonly string[] CandidateHeaders = ["X-Azure-ClientIP", "X-Client-IP", "X-Forwarded-For"];

    /// <summary>
    /// Best-effort client IP for rate limiting. Header values can be spoofed, so this
    /// is only suitable for soft limits, never for authorisation.
    /// </summary>
    public static string Resolve(HttpRequest request)
    {
        foreach (var header in CandidateHeaders)
        {
            // Lists like "client, proxy1, proxy2" put the original client first.
            var first = request.Headers[header].ToString()
                .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
                .FirstOrDefault();

            if (first is not null && TryParse(first, out var address)) return address;
        }

        return request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    /// <summary>Accepts "1.2.3.4", "1.2.3.4:5678", "::1" and "[::1]:5678".</summary>
    private static bool TryParse(string value, out string address)
    {
        if (IPAddress.TryParse(value, out var ip))
        {
            address = ip.ToString();
            return true;
        }

        if (IPEndPoint.TryParse(value, out var endpoint))
        {
            address = endpoint.Address.ToString();
            return true;
        }

        address = "";
        return false;
    }
}
