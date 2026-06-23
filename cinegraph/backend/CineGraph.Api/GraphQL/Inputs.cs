namespace CineGraph.Api.GraphQL;

public record LoginInput(string Email, string Password);

public record AuthPayload(string Token, string Name);

public record AddMovieInput(
    string Title,
    string Synopsis,
    int ReleaseYear,
    int DurationMinutes,
    int[]? GenreIds);

public record AddReviewInput(int MovieId, string Author, int Rating, string? Comment);
