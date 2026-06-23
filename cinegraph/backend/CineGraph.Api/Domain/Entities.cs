namespace CineGraph.Api.Domain;

/// <summary>Papel de uma pessoa no elenco de um filme.</summary>
public enum CastRole
{
    Actor,
    Director,
}

/// <summary>Filme/Serie do catalogo (agregado central).</summary>
public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Synopsis { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public int DurationMinutes { get; set; }

    public ICollection<Genre> Genres { get; set; } = new List<Genre>();
    public ICollection<CastMember> Cast { get; set; } = new List<CastMember>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

/// <summary>Genero (Acao, Drama, ...). Many-to-many com Movie.</summary>
public class Genre
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public ICollection<Movie> Movies { get; set; } = new List<Movie>();
}

/// <summary>Pessoa (ator/atriz ou diretor).</summary>
public class Person
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Bio { get; set; } = string.Empty;
    public int? BirthYear { get; set; }
    public ICollection<CastMember> Roles { get; set; } = new List<CastMember>();
}

/// <summary>Associacao Pessoa &lt;-&gt; Filme com papel e personagem.</summary>
public class CastMember
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = default!;
    public int PersonId { get; set; }
    public Person Person { get; set; } = default!;
    public string Character { get; set; } = string.Empty;
    public CastRole Role { get; set; }
}

/// <summary>Avaliacao de um filme (nota 1..5).</summary>
public class Review
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = default!;
    public string Author { get; set; } = default!;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Usuario para autenticacao (login -&gt; JWT).</summary>
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string Name { get; set; } = default!;
}
