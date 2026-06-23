using CineGraph.Api.Data;
using CineGraph.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CineGraph.Api.GraphQL;

/// <summary>Campos computados do tipo Movie (ex.: nota media das avaliacoes).</summary>
[ExtendObjectType<Movie>]
public class MovieExtensions
{
    /// <summary>Nota media (1..5) calculada a partir das avaliacoes.</summary>
    public async Task<double> GetAverageRating([Parent] Movie movie, AppDbContext db)
    {
        var ratings = await db.Reviews
            .Where(r => r.MovieId == movie.Id)
            .Select(r => r.Rating)
            .ToListAsync();
        return ratings.Count == 0 ? 0 : Math.Round(ratings.Average(), 2);
    }

    /// <summary>Quantidade de avaliacoes do filme.</summary>
    public async Task<int> GetReviewCount([Parent] Movie movie, AppDbContext db) =>
        await db.Reviews.CountAsync(r => r.MovieId == movie.Id);
}
