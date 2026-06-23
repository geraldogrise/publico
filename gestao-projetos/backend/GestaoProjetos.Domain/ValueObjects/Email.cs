using System.Text.RegularExpressions;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.ValueObjects;

/// <summary>
/// Value Object que garante que um endereco de e-mail seja sempre valido.
/// Imutavel e comparado por valor.
/// </summary>
public sealed record Email
{
    private static readonly Regex Padrao = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Valor { get; }

    private Email(string valor) => Valor = valor;

    public static Email Criar(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            throw new DominioException("E-mail nao pode ser vazio.");

        valor = valor.Trim().ToLowerInvariant();

        if (!Padrao.IsMatch(valor))
            throw new DominioException($"E-mail invalido: '{valor}'.");

        return new Email(valor);
    }

    public override string ToString() => Valor;
}
