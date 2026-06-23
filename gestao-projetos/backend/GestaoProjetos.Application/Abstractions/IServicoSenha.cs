namespace GestaoProjetos.Application.Abstractions;

/// <summary>
/// Port para hash e verificacao de senhas. Implementado na Infraestrutura.
/// </summary>
public interface IServicoSenha
{
    string GerarHash(string senha);
    bool Verificar(string senha, string hash);
}
