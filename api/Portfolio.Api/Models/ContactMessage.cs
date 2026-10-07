namespace Portfolio.Api.Models;

/// <summary>A validated, trimmed contact message, ready to be sent.</summary>
public sealed record ContactMessage(string Name, string Email, string Message);
