using System.Collections.Concurrent;
using Microsoft.Extensions.Options;
using Portfolio.Api.Options;

namespace Portfolio.Api.Services.RateLimiting;

/// <summary>
/// In-memory fixed-window limiter: each key gets <c>PermitLimit</c> attempts per window.
/// </summary>
/// <remarks>
/// State lives in this process only, so each Functions instance counts separately and
/// counts reset when an instance recycles. That's an acceptable trade-off for a
/// low-traffic contact form on the Free plan; a shared store (e.g. Redis or Table
/// Storage) would be needed for strict limits.
/// </remarks>
public sealed class FixedWindowRateLimiter : IRateLimiter
{
    private const int CleanupThreshold = 1000;

    private readonly ConcurrentDictionary<string, Window> _windows = new();
    private readonly TimeProvider _time;
    private readonly int _permitLimit;
    private readonly TimeSpan _window;

    public FixedWindowRateLimiter(IOptions<ContactRateLimitOptions> options, TimeProvider time)
    {
        _time = time;
        _permitLimit = options.Value.PermitLimit;
        _window = options.Value.Window;
    }

    public RateLimitDecision TryAcquire(string key)
    {
        var now = _time.GetUtcNow();
        if (_windows.Count > CleanupThreshold) RemoveExpired(now);

        var window = _windows.AddOrUpdate(
            key,
            _ => new Window(now, 1),
            (_, current) => now - current.Start >= _window
                ? new Window(now, 1)
                : current with { Count = current.Count + 1 });

        return window.Count <= _permitLimit
            ? RateLimitDecision.Allowed
            : RateLimitDecision.Rejected(window.Start + _window - now);
    }

    private void RemoveExpired(DateTimeOffset now)
    {
        foreach (var (key, window) in _windows)
        {
            if (now - window.Start >= _window) _windows.TryRemove(key, out _);
        }
    }

    private sealed record Window(DateTimeOffset Start, int Count);
}
