using System.Net.Mail;
using Portfolio.Api.Models;

namespace Portfolio.Api.Validation;

/// <summary>
/// Server-side validation for the contact form. Limits match the
/// maxLength/minLength attributes in web/components/sections/ContactForm.tsx.
/// </summary>
public static class ContactRequestValidator
{
    public const int NameMaxLength = 100;
    public const int EmailMaxLength = 254;
    public const int MessageMinLength = 10;
    public const int MessageMaxLength = 5000;

    /// <summary>
    /// Validates and normalises the request. Error keys are camelCase field
    /// names so the frontend can show each message next to its input.
    /// </summary>
    public static ValidationResult<ContactMessage> Validate(ContactRequest request)
    {
        var errors = new Dictionary<string, string[]>();

        var name = request.Name?.Trim() ?? "";
        var email = request.Email?.Trim() ?? "";
        var message = request.Message?.Trim() ?? "";

        if (name.Length == 0)
            errors["name"] = ["Please enter your name."];
        else if (name.Length > NameMaxLength)
            errors["name"] = [$"Name must be {NameMaxLength} characters or fewer."];
        else if (name.Any(char.IsControl))
            errors["name"] = ["Name contains invalid characters."];

        if (email.Length == 0)
            errors["email"] = ["Please enter your email address."];
        else if (email.Length > EmailMaxLength || !IsValidEmail(email))
            errors["email"] = ["Please enter a valid email address."];

        if (message.Length < MessageMinLength)
            errors["message"] = [$"Message must be at least {MessageMinLength} characters."];
        else if (message.Length > MessageMaxLength)
            errors["message"] = [$"Message must be {MessageMaxLength} characters or fewer."];

        return errors.Count == 0
            ? ValidationResult<ContactMessage>.Success(new ContactMessage(name, email, message))
            : ValidationResult<ContactMessage>.Failure(errors);
    }

    private static bool IsValidEmail(string email)
    {
        // MailAddress accepts display-name forms like "Bob <bob@x.com>", so also
        // require the parsed address to be exactly the input, with a dotted domain.
        if (!MailAddress.TryCreate(email, out var address) || address.Address != email)
            return false;

        var domain = address.Host;
        return domain.Contains('.') && !domain.StartsWith('.') && !domain.EndsWith('.');
    }
}
