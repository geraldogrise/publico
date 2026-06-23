using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Domain.Entities;

namespace GestaoProjetos.Application.Mapeamento;

/// <summary>
/// Mapeadores de entidades de dominio para DTOs. Mantidos simples e explicitos
/// (sem dependencia de bibliotecas externas) para clareza.
/// </summary>
public static class Mapeadores
{
    public static UsuarioDto ParaDto(this Usuario u) =>
        new(u.Id, u.Nome, u.Email.Valor);

    public static ProjetoDto ParaDto(this Projeto p) =>
        new(
            p.Id,
            p.Nome,
            p.Descricao,
            p.Status,
            p.EquipeId,
            p.Equipe?.Nome,
            p.DataInicio,
            p.DataFimPrevista,
            p.Tarefas.Count,
            p.CriadoEm);

    public static EtiquetaDto ParaDto(this Etiqueta e) =>
        new(e.Id, e.Nome, e.Cor);

    public static TarefaDto ParaDto(this Tarefa t) =>
        new(
            t.Id,
            t.Titulo,
            t.Descricao,
            t.Status,
            t.Prioridade,
            t.Ordem,
            t.Prazo,
            t.ProjetoId,
            t.SprintId,
            t.ResponsavelId,
            t.Responsavel?.Nome,
            t.Etiquetas.Select(ParaDto).ToList(),
            t.Comentarios.Count,
            t.CriadoEm);

    public static SprintDto ParaDto(this Sprint s) =>
        new(
            s.Id,
            s.Nome,
            s.Objetivo,
            s.ProjetoId,
            s.DataInicio,
            s.DataFim,
            s.Ativa,
            s.Tarefas.Count);

    public static EquipeDto ParaDto(this Equipe e) =>
        new(
            e.Id,
            e.Nome,
            e.Descricao,
            e.Membros.Select(m => new MembroDto(
                m.UsuarioId,
                m.Usuario?.Nome ?? string.Empty,
                m.Usuario?.Email.Valor ?? string.Empty,
                m.Papel)).ToList(),
            e.Projetos.Count);
}
