namespace Portfolio.Api.Services.RateLimiting;

public interface IRateLimiter
{
    /// <summary>Records an attempt for <paramref name="key"/> and says whether it is allowed.</summary>
    RateLimitDecision TryAcquire(string key);
}

/// <param name="RetryAfter">How long until the caller may try again. Zero when allowed.</param>
public readonly record struct RateLimitDecision(bool IsAllowed, TimeSpan RetryAfter)
{
    public static RateLimitDecision Allowed => new(true, TimeSpan.Zero);

    public static RateLimitDecision Rejected(TimeSpan retryAfter) => new(false, retryAfter);
}
