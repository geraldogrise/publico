using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Anexo (arquivo) vinculado a uma tarefa.
/// </summary>
public class Anexo : EntidadeBase
{
    public string NomeArquivo { get; private set; } = string.Empty;
    public string Url { get; private set; } = string.Empty;
    public long TamanhoBytes { get; private set; }

    public Guid TarefaId { get; private set; }
    public Tarefa Tarefa { get; private set; } = null!;

    protected Anexo() { }

    public Anexo(Tarefa tarefa, string nomeArquivo, string url, long tamanhoBytes)
    {
        Tarefa = tarefa ?? throw new DominioException("Anexo precisa de uma tarefa.");
        TarefaId = tarefa.Id;

        if (string.IsNullOrWhiteSpace(nomeArquivo))
            throw new DominioException("Nome do arquivo e obrigatorio.");
        if (string.IsNullOrWhiteSpace(url))
            throw new DominioException("URL do anexo e obrigatoria.");

        NomeArquivo = nomeArquivo.Trim();
        Url = url.Trim();
        TamanhoBytes = tamanhoBytes < 0 ? 0 : tamanhoBytes;
    }
}
