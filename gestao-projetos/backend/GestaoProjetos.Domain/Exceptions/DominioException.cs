namespace GestaoProjetos.Domain.Exceptions;

/// <summary>
/// Excecao lancada quando uma invariante de dominio e violada.
/// </summary>
public class DominioException : Exception
{
    public DominioException(string mensagem) : base(mensagem) { }
}
