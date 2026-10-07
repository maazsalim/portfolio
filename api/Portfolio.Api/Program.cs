using System.Net.Http.Headers;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Portfolio.Api.Options;
using Portfolio.Api.Services.Email;
using Portfolio.Api.Services.GitHub;
using Portfolio.Api.Services.RateLimiting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

var services = builder.Services;
var config = builder.Configuration;

services.AddMemoryCache();
services.AddSingleton(TimeProvider.System);

// Options come from app settings (local.settings.json locally, SWA environment variables in Azure).
services.Configure<ResendOptions>(config.GetSection(ResendOptions.SectionName));
services.Configure<GitHubOptions>(config.GetSection(GitHubOptions.SectionName));
services.Configure<ContactRateLimitOptions>(config.GetSection(ContactRateLimitOptions.SectionName));

// Singleton so the in-memory counters are shared across requests.
services.AddSingleton<IRateLimiter, FixedWindowRateLimiter>();

// Without a Resend key in local development, log messages instead of sending them.
var resendConfigured = config.GetSection(ResendOptions.SectionName).Get<ResendOptions>()?.IsConfigured ?? false;
if (builder.Environment.IsDevelopment() && !resendConfigured)
{
    services.AddSingleton<IEmailSender, LoggingEmailSender>();
}
else
{
    services.AddHttpClient<IEmailSender, ResendEmailSender>(client =>
    {
        client.BaseAddress = new Uri("https://api.resend.com/");
        client.Timeout = TimeSpan.FromSeconds(10);
    });
}

services.AddHttpClient<IGitHubService, GitHubService>((provider, client) =>
{
    var options = provider.GetRequiredService<IOptions<GitHubOptions>>().Value;
    client.BaseAddress = new Uri("https://api.github.com/");
    client.Timeout = TimeSpan.FromSeconds(10);
    client.DefaultRequestHeaders.UserAgent.ParseAdd("maazsalim-portfolio-api");
    client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");
    client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
    if (!string.IsNullOrWhiteSpace(options.Token))
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", options.Token);
});

builder.Build().Run();
