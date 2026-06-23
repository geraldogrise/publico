using GestaoProjetos.Application.Abstractions;
using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Enums;
using GestaoProjetos.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Persistence;

/// <summary>
/// Cria o banco (se necessario) e popula dados de demonstracao para que a UI
/// tenha conteudo logo no primeiro acesso.
/// </summary>
public static class DbInitializer
{
    public static async Task InicializarAsync(AppDbContext context, IServicoSenha servicoSenha, CancellationToken ct = default)
    {
        await context.Database.EnsureCreatedAsync(ct);

        if (await context.Usuarios.AnyAsync(ct))
            return; // Ja semeado.

        // ---- Usuarios ----
        var admin = new Usuario("Administrador Demo", Email.Criar("admin@demo.com"), servicoSenha.GerarHash("123456"));
        var ana = new Usuario("Ana Desenvolvedora", Email.Criar("ana@demo.com"), servicoSenha.GerarHash("123456"));
        var bruno = new Usuario("Bruno QA", Email.Criar("bruno@demo.com"), servicoSenha.GerarHash("123456"));
        await context.Usuarios.AddRangeAsync(new[] { admin, ana, bruno }, ct);

        // ---- Equipe + membros ----
        var equipe = new Equipe("Time Plataforma", "Equipe responsavel pela plataforma principal.");
        equipe.AdicionarMembro(admin, PapelMembro.Administrador);
        equipe.AdicionarMembro(ana, PapelMembro.Lider);
        equipe.AdicionarMembro(bruno, PapelMembro.Membro);
        await context.Equipes.AddAsync(equipe, ct);

        // ---- Etiquetas ----
        var etBug = new Etiqueta("Bug", "#e74c3c");
        var etFeature = new Etiqueta("Feature", "#2ecc71");
        var etUrgente = new Etiqueta("Urgente", "#e67e22");
        await context.Etiquetas.AddRangeAsync(new[] { etBug, etFeature, etUrgente }, ct);

        // ---- Projeto 1 ----
        var projeto = new Projeto(
            "Portal do Cliente",
            equipe,
            "Novo portal de autoatendimento para clientes.",
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddMonths(3));
        projeto.AlterarStatus(StatusProjeto.EmAndamento);
        await context.Projetos.AddAsync(projeto, ct);

        var sprint = new Sprint(
            "Sprint 1 - Fundacoes",
            projeto,
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(14),
            "Configurar base do projeto e autenticacao.");
        sprint.Ativar();
        await context.Sprints.AddAsync(sprint, ct);

        var t1 = new Tarefa("Configurar pipeline CI/CD", projeto, "Criar workflow de build e testes.", PrioridadeTarefa.Alta, StatusTarefa.Concluido);
        t1.AssociarSprint(sprint);
        t1.AtribuirA(ana);
        t1.AdicionarEtiqueta(etFeature);

        var t2 = new Tarefa("Tela de login", projeto, "Implementar autenticacao JWT no front e back.", PrioridadeTarefa.Critica, StatusTarefa.EmAndamento);
        t2.AssociarSprint(sprint);
        t2.AtribuirA(ana);
        t2.AdicionarEtiqueta(etFeature);
        t2.AdicionarEtiqueta(etUrgente);
        t2.DefinirPrazo(DateTime.UtcNow.Date.AddDays(5));

        var t3 = new Tarefa("Corrigir layout responsivo no board", projeto, "Cards quebram em telas pequenas.", PrioridadeTarefa.Media, StatusTarefa.AFazer);
        t3.AssociarSprint(sprint);
        t3.AtribuirA(bruno);
        t3.AdicionarEtiqueta(etBug);

        var t4 = new Tarefa("Documentar API no Swagger", projeto, "Adicionar descricoes e exemplos.", PrioridadeTarefa.Baixa, StatusTarefa.Backlog);
        t4.AdicionarEtiqueta(etFeature);

        await context.Tarefas.AddRangeAsync(new[] { t1, t2, t3, t4 }, ct);

        // Comentarios
        t2.AdicionarComentario(admin, "Lembrar de configurar o botao Authorize no Swagger.");
        t2.AdicionarComentario(ana, "Token JWT ja esta sendo emitido no login.");

        // ---- Projeto 2 ----
        var projeto2 = new Projeto(
            "App Mobile",
            equipe,
            "Aplicativo mobile para acompanhamento de tarefas.",
            DateTime.UtcNow.Date.AddDays(-10),
            DateTime.UtcNow.Date.AddMonths(2));
        projeto2.AlterarStatus(StatusProjeto.Planejado);
        await context.Projetos.AddAsync(projeto2, ct);

        var t5 = new Tarefa("Prototipo de telas", projeto2, "Desenhar fluxo principal no Figma.", PrioridadeTarefa.Media, StatusTarefa.AFazer);
        t5.AtribuirA(bruno);
        var t6 = new Tarefa("Definir stack do app", projeto2, "Avaliar opcoes de framework.", PrioridadeTarefa.Alta, StatusTarefa.Backlog);
        await context.Tarefas.AddRangeAsync(new[] { t5, t6 }, ct);

        await context.SaveChangesAsync(ct);
    }
}
