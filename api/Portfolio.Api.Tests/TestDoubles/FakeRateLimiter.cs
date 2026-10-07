using Portfolio.Api.Services.RateLimiting;

namespace Portfolio.Api.Tests.TestDoubles;

public sealed class FakeRateLimiter(RateLimitDecision decision) : IRateLimiter
{
    public List<string> Keys { get; } = [];

    public static FakeRateLimiter Allowing() => new(RateLimitDecision.Allowed);

    public static FakeRateLimiter Rejecting(TimeSpan retryAfter) => new(RateLimitDecision.Rejected(retryAfter));

    public RateLimitDecision TryAcquire(string key)
    {
        Keys.Add(key);
        return decision;
    }
}
