using Microsoft.Extensions.Time.Testing;
using Portfolio.Api.Options;
using Portfolio.Api.Services.RateLimiting;
using MsOptions = Microsoft.Extensions.Options.Options;

namespace Portfolio.Api.Tests.RateLimiting;

public class FixedWindowRateLimiterTests
{
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(15);

    private readonly FakeTimeProvider _time = new(new DateTimeOffset(2026, 1, 1, 12, 0, 0, TimeSpan.Zero));

    private FixedWindowRateLimiter CreateLimiter(int permitLimit = 3) =>
        new(MsOptions.Create(new ContactRateLimitOptions { PermitLimit = permitLimit, Window = Window }), _time);

    [Fact]
    public void Allows_requests_up_to_the_limit()
    {
        var limiter = CreateLimiter(permitLimit: 3);

        Assert.All(Enumerable.Range(0, 3), _ => Assert.True(limiter.TryAcquire("1.2.3.4").IsAllowed));
    }

    [Fact]
    public void Rejects_requests_over_the_limit_with_time_until_reset()
    {
        var limiter = CreateLimiter(permitLimit: 2);
        limiter.TryAcquire("1.2.3.4");
        _time.Advance(TimeSpan.FromMinutes(5));
        limiter.TryAcquire("1.2.3.4");

        var decision = limiter.TryAcquire("1.2.3.4");

        Assert.False(decision.IsAllowed);
        Assert.Equal(TimeSpan.FromMinutes(10), decision.RetryAfter);
    }

    [Fact]
    public void Allows_again_after_the_window_passes()
    {
        var limiter = CreateLimiter(permitLimit: 1);
        limiter.TryAcquire("1.2.3.4");
        Assert.False(limiter.TryAcquire("1.2.3.4").IsAllowed);

        _time.Advance(Window);

        Assert.True(limiter.TryAcquire("1.2.3.4").IsAllowed);
    }

    [Fact]
    public void Tracks_each_key_separately()
    {
        var limiter = CreateLimiter(permitLimit: 1);
        limiter.TryAcquire("1.2.3.4");

        Assert.False(limiter.TryAcquire("1.2.3.4").IsAllowed);
        Assert.True(limiter.TryAcquire("5.6.7.8").IsAllowed);
    }

    [Fact]
    public void Stays_correct_under_concurrent_requests()
    {
        var limiter = CreateLimiter(permitLimit: 10);

        var allowed = 0;
        Parallel.For(0, 100, _ =>
        {
            if (limiter.TryAcquire("1.2.3.4").IsAllowed) Interlocked.Increment(ref allowed);
        });

        Assert.Equal(10, allowed);
    }
}
