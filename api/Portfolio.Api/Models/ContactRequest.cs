namespace Portfolio.Api.Models;

/// <summary>Body of POST /api/contact. All fields are nullable because the input is untrusted.</summary>
/// <param name="Website">Honeypot field. Hidden from people, so any value means a bot.</param>
public sealed record ContactRequest(string? Name, string? Email, string? Message, string? Website);
