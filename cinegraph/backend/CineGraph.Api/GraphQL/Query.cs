using CineGraph.Api.Data;
using CineGraph.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CineGraph.Api.GraphQL;

/// <summary>Raiz de consultas GraphQL do CineGraph.</summary>
public class Query
{
    /// <summary>Lista filmes (com filtro e ordenacao via GraphQL).</summary>
    [UseFiltering]
    [UseSorting]
    public IQueryable<Movie> GetMovies(AppDbContext db) =>
        db.Movies
            .Include(m => m.Genres)
            .Include(m => m.Reviews)
            .Include(m => m.Cast).ThenInclude(c => c.Person);

    /// <summary>Busca um filme pelo id.</summary>
    public Task<Movie?> GetMovieById(int id, AppDbContext db) =>
        db.Movies
            .Include(m => m.Genres)
            .Include(m => m.Reviews)
            .Include(m => m.Cast).ThenInclude(c => c.Person)
            .FirstOrDefaultAsync(m => m.Id == id);

    /// <summary>Busca textual por titulo ou sinopse.</summary>
    public async Task<IReadOnlyList<Movie>> SearchMovies(string term, AppDbContext db)
    {
        var t = (term ?? string.Empty).ToLower();
        return await db.Movies
            .Include(m => m.Genres)
            .Include(m => m.Reviews)
            .Where(m => m.Title.ToLower().Contains(t) || m.Synopsis.ToLower().Contains(t))
            .ToListAsync();
    }

    [UseFiltering]
    [UseSorting]
    public IQueryable<Genre> GetGenres(AppDbContext db) => db.Genres.Include(g => g.Movies);

    [UseFiltering]
    [UseSorting]
    public IQueryable<Person> GetPeople(AppDbContext db) =>
        db.People.Include(p => p.Roles).ThenInclude(r => r.Movie);
}
