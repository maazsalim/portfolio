namespace Portfolio.Api.Options;

/// <summary>Bound from the "ContactRateLimit" config section.</summary>
public sealed class ContactRateLimitOptions
{
    public const string SectionName = "ContactRateLimit";

    /// <summary>Messages allowed per client IP within one window.</summary>
    public int PermitLimit { get; set; } = 3;

    public TimeSpan Window { get; set; } = TimeSpan.FromMinutes(15);
}
