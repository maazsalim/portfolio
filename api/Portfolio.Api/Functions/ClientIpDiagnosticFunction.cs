using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Portfolio.Api.Http;

namespace Portfolio.Api.Functions;

/// <summary>
/// TEMPORARY: GET /api/diagnostics/client-ip shows how the deployed API sees the
/// caller, to confirm which header Azure Static Web Apps uses for the client IP.
/// Returns only the caller's own address and header names. Remove once verified.
/// </summary>
public sealed class ClientIpDiagnosticFunction
{
    private static readonly string[] IpHeaders = ["CLIENT-IP", "X-Azure-ClientIP", "X-Client-IP", "X-Forwarded-For", "X-Original-For"];

    [Function("ClientIpDiagnostic")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "diagnostics/client-ip")] HttpRequest request)
    {
        return new OkObjectResult(new
        {
            resolved = ClientIp.Resolve(request),
            remoteIpAddress = request.HttpContext.Connection.RemoteIpAddress?.ToString(),
            ipHeaders = IpHeaders.ToDictionary(h => h, h => request.Headers[h].ToString()),
            headerNames = request.Headers.Keys.Order(StringComparer.OrdinalIgnoreCase),
        });
    }
}
