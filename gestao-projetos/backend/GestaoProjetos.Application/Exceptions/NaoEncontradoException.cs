namespace GestaoProjetos.Application.Exceptions;

/// <summary>
/// Lancada por casos de uso quando um recurso solicitado nao existe.
/// </summary>
public class NaoEncontradoException : Exception
{
    public NaoEncontradoException(string recurso, Guid id)
        : base($"{recurso} com Id '{id}' nao encontrado.") { }

    public NaoEncontradoException(string mensagem) : base(mensagem) { }
}
