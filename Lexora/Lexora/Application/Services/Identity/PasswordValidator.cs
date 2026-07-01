using global::System.Text.RegularExpressions;
using Lexora.Domain.Exceptions;

namespace Lexora.Application.Services.Identity;

public static class PasswordValidator
{
    public static void Validate(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new DomainException("كلمة المرور مطلوبة ولا يمكن أن تكون فارغة.");
        }

        if (password.Length < 8)
        {
            throw new DomainException("يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.");
        }

        if (!Regex.IsMatch(password, "[A-Z]"))
        {
            throw new DomainException("يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z).");
        }

        if (!Regex.IsMatch(password, "[a-z]"))
        {
            throw new DomainException("يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z).");
        }

        if (!Regex.IsMatch(password, "[0-9]"))
        {
            throw new DomainException("يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9).");
        }

        // يشمل الرموز الخاصة المعتادة والمسافات
        if (!Regex.IsMatch(password, @"[\W_]"))
        {
            throw new DomainException("يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل.");
        }
    }
}
