using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Repositories;

public class UsuarioRepositorio : RepositorioBase<Usuario>, IUsuarioRepositorio
{
    public UsuarioRepositorio(AppDbContext context) : base(context) { }

    public async Task<Usuario?> ObterPorEmailAsync(string email, CancellationToken ct = default)
    {
        var alvo = email.Trim().ToLowerInvariant();
        // Email e Value Object convertido; comparamos pela coluna materializada.
        return await Set.FirstOrDefaultAsync(u => u.Email.Valor == alvo, ct);
    }
}
