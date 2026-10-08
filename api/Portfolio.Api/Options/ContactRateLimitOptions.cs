namespace Portfolio.Api.Options;

/// <summary>Bound from the "ContactRateLimit" config section.</summary>
public sealed class ContactRateLimitOptions
{
    public const string SectionName = "ContactRateLimit";

    /// <summary>Messages allowed across the whole site within one window.</summary>
    public int PermitLimit { get; set; } = 20;

    public TimeSpan Window { get; set; } = TimeSpan.FromHours(1);
}
