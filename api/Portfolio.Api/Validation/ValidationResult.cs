using System.Diagnostics.CodeAnalysis;

namespace Portfolio.Api.Validation;

/// <summary>Either a valid, normalised value or a set of field errors.</summary>
public sealed class ValidationResult<T> where T : class
{
    private ValidationResult(T? value, IReadOnlyDictionary<string, string[]> errors)
    {
        Value = value;
        Errors = errors;
    }

    public T? Value { get; }

    public IReadOnlyDictionary<string, string[]> Errors { get; }

    [MemberNotNullWhen(true, nameof(Value))]
    public bool IsValid => Value is not null;

    public static ValidationResult<T> Success(T value) => new(value, new Dictionary<string, string[]>());

    public static ValidationResult<T> Failure(IReadOnlyDictionary<string, string[]> errors) => new(null, errors);
}
