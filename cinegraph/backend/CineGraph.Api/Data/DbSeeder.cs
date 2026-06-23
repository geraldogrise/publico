using CineGraph.Api.Auth;
using CineGraph.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CineGraph.Api.Data;

/// <summary>Popula o catalogo com dados de demonstracao.</summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (await db.Users.AnyAsync()) return;

        db.Users.Add(new User
        {
            Name = "Administrador Demo",
            Email = "admin@demo.com",
            PasswordHash = PasswordHasher.Hash("123456"),
        });

        var acao = new Genre { Name = "Acao" };
        var ficcao = new Genre { Name = "Ficcao Cientifica" };
        var drama = new Genre { Name = "Drama" };
        var crime = new Genre { Name = "Crime" };
        db.Genres.AddRange(acao, ficcao, drama, crime);

        var nolan = new Person { Name = "Christopher Nolan", BirthYear = 1970, Bio = "Diretor britanico-americano." };
        var dicaprio = new Person { Name = "Leonardo DiCaprio", BirthYear = 1974, Bio = "Ator americano." };
        var keanu = new Person { Name = "Keanu Reeves", BirthYear = 1964, Bio = "Ator canadense." };
        var coppola = new Person { Name = "Francis Ford Coppola", BirthYear = 1939, Bio = "Diretor americano." };
        var pacino = new Person { Name = "Al Pacino", BirthYear = 1940, Bio = "Ator americano." };
        db.People.AddRange(nolan, dicaprio, keanu, coppola, pacino);

        var inception = new Movie
        {
            Title = "A Origem",
            Synopsis = "Um ladrao que invade sonhos recebe a tarefa de plantar uma ideia.",
            ReleaseYear = 2010,
            DurationMinutes = 148,
            Genres = new List<Genre> { acao, ficcao },
        };
        inception.Cast.Add(new CastMember { Person = nolan, Role = CastRole.Director });
        inception.Cast.Add(new CastMember { Person = dicaprio, Role = CastRole.Actor, Character = "Dom Cobb" });
        inception.Reviews.Add(new Review { Author = "Maria", Rating = 5, Comment = "Obra-prima!" });
        inception.Reviews.Add(new Review { Author = "Joao", Rating = 4, Comment = "Muito bom, complexo." });

        var matrix = new Movie
        {
            Title = "Matrix",
            Synopsis = "Um hacker descobre a verdade sobre a sua realidade.",
            ReleaseYear = 1999,
            DurationMinutes = 136,
            Genres = new List<Genre> { acao, ficcao },
        };
        matrix.Cast.Add(new CastMember { Person = keanu, Role = CastRole.Actor, Character = "Neo" });
        matrix.Reviews.Add(new Review { Author = "Ana", Rating = 5, Comment = "Revolucionario." });

        var godfather = new Movie
        {
            Title = "O Poderoso Chefao",
            Synopsis = "A saga da familia Corleone no mundo do crime organizado.",
            ReleaseYear = 1972,
            DurationMinutes = 175,
            Genres = new List<Genre> { drama, crime },
        };
        godfather.Cast.Add(new CastMember { Person = coppola, Role = CastRole.Director });
        godfather.Cast.Add(new CastMember { Person = pacino, Role = CastRole.Actor, Character = "Michael Corleone" });
        godfather.Reviews.Add(new Review { Author = "Carlos", Rating = 5, Comment = "Classico atemporal." });

        db.Movies.AddRange(inception, matrix, godfather);

        await db.SaveChangesAsync();
    }
}
