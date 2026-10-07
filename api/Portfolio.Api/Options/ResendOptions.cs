namespace Portfolio.Api.Options;

/// <summary>Bound from the "Resend" config section (app settings: Resend__ApiKey, ...).</summary>
public sealed class ResendOptions
{
    public const string SectionName = "Resend";

    public string ApiKey { get; set; } = "";

    /// <summary>Sender, e.g. "Portfolio &lt;onboarding@resend.dev&gt;". Must be a Resend-verified address.</summary>
    public string From { get; set; } = "";

    /// <summary>Where contact messages are delivered.</summary>
    public string To { get; set; } = "";

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(ApiKey) && !string.IsNullOrWhiteSpace(From) && !string.IsNullOrWhiteSpace(To);
}
