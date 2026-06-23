namespace GestaoProjetos.Application.Exceptions;

/// <summary>
/// Lancada quando as credenciais informadas sao invalidas.
/// </summary>
public class AutenticacaoException : Exception
{
    public AutenticacaoException(string mensagem = "Credenciais invalidas.") : base(mensagem) { }
}
