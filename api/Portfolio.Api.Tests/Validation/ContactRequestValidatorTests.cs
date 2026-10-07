using Portfolio.Api.Models;
using Portfolio.Api.Validation;

namespace Portfolio.Api.Tests.Validation;

public class ContactRequestValidatorTests
{
    private static ContactRequest Valid(string? name = "Ada Lovelace", string? email = "ada@example.com", string? message = "Hello, I'd like to chat about a role.") =>
        new(name, email, message, Website: null);

    [Fact]
    public void Valid_request_returns_trimmed_message()
    {
        var result = ContactRequestValidator.Validate(Valid(name: "  Ada  ", email: " ada@example.com ", message: "  Hello there, Maaz!  "));

        Assert.True(result.IsValid);
        Assert.Equal(new ContactMessage("Ada", "ada@example.com", "Hello there, Maaz!"), result.Value);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public void Missing_fields_report_an_error_for_each_field()
    {
        var result = ContactRequestValidator.Validate(new ContactRequest(null, null, null, null));

        Assert.False(result.IsValid);
        Assert.Equal(["email", "message", "name"], result.Errors.Keys.Order());
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Blank_name_is_rejected(string name)
    {
        var result = ContactRequestValidator.Validate(Valid(name: name));

        Assert.Equal("Please enter your name.", Assert.Single(result.Errors["name"]));
    }

    [Fact]
    public void Name_over_max_length_is_rejected()
    {
        var result = ContactRequestValidator.Validate(Valid(name: new string('a', ContactRequestValidator.NameMaxLength + 1)));

        Assert.True(result.Errors.ContainsKey("name"));
    }

    [Fact]
    public void Name_with_control_characters_is_rejected()
    {
        var result = ContactRequestValidator.Validate(Valid(name: "Ada\r\nBcc: victim@example.com"));

        Assert.True(result.Errors.ContainsKey("name"));
    }

    [Theory]
    [InlineData("ada@example.com")]
    [InlineData("first.last+tag@sub.example.co.uk")]
    public void Valid_emails_are_accepted(string email)
    {
        Assert.True(ContactRequestValidator.Validate(Valid(email: email)).IsValid);
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("ada@")]
    [InlineData("@example.com")]
    [InlineData("ada@localhost")]
    [InlineData("Ada <ada@example.com>")]
    [InlineData("ada@example.com, eve@example.com")]
    public void Invalid_emails_are_rejected(string email)
    {
        var result = ContactRequestValidator.Validate(Valid(email: email));

        Assert.Equal("Please enter a valid email address.", Assert.Single(result.Errors["email"]));
    }

    [Fact]
    public void Message_shorter_than_minimum_is_rejected()
    {
        var result = ContactRequestValidator.Validate(Valid(message: "Hi"));

        Assert.True(result.Errors.ContainsKey("message"));
    }

    [Fact]
    public void Message_length_is_measured_after_trimming()
    {
        var result = ContactRequestValidator.Validate(Valid(message: "   short    "));

        Assert.True(result.Errors.ContainsKey("message"));
    }

    [Fact]
    public void Message_over_max_length_is_rejected()
    {
        var result = ContactRequestValidator.Validate(Valid(message: new string('a', ContactRequestValidator.MessageMaxLength + 1)));

        Assert.True(result.Errors.ContainsKey("message"));
    }
}
