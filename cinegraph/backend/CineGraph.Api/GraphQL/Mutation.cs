using CineGraph.Api.Auth;
using CineGraph.Api.Data;
using CineGraph.Api.Domain;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CineGraph.Api.GraphQL;

/// <summary>Raiz de mutations GraphQL do CineGraph.</summary>
public class Mutation
{
    /// <summary>Autentica e retorna um token JWT.</summary>
    public async Task<AuthPayload> Login(LoginInput input, AppDbContext db, JwtTokenService tokens)
    {
        var email = (input.Email ?? string.Empty).ToLower().Trim();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || !PasswordHasher.Verify(input.Password, user.PasswordHash))
            throw new GraphQLException("Credenciais invalidas.");

        return new AuthPayload(tokens.Generate(user), user.Name);
    }

    /// <summary>Adiciona uma avaliacao a um filme (publico).</summary>
    public async Task<Review> AddReview(AddReviewInput input, AppDbContext db)
    {
        if (input.Rating < 1 || input.Rating > 5)
            throw new GraphQLException("A nota deve estar entre 1 e 5.");

        var movie = await db.Movies.FindAsync(input.MovieId)
            ?? throw new GraphQLException("Filme nao encontrado.");

        var review = new Review
        {
            MovieId = movie.Id,
            Author = input.Author,
            Rating = input.Rating,
            Comment = input.Comment ?? string.Empty,
        };
        db.Reviews.Add(review);
        await db.SaveChangesAsync();
        return review;
    }

    /// <summary>Cadastra um novo filme (requer autenticacao JWT).</summary>
    [Authorize]
    public async Task<Movie> AddMovie(AddMovieInput input, AppDbContext db)
    {
        var movie = new Movie
        {
            Title = input.Title,
            Synopsis = input.Synopsis,
            ReleaseYear = input.ReleaseYear,
            DurationMinutes = input.DurationMinutes,
        };

        if (input.GenreIds is { Length: > 0 })
        {
            var genres = await db.Genres.Where(g => input.GenreIds.Contains(g.Id)).ToListAsync();
            foreach (var g in genres) movie.Genres.Add(g);
        }

        db.Movies.Add(movie);
        await db.SaveChangesAsync();
        return movie;
    }
}
