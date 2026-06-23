/** Documentos GraphQL (queries e mutations) usados pela aplicacao. */

export const MOVIES_QUERY = `
  query Movies {
    movies {
      id
      title
      releaseYear
      durationMinutes
      averageRating
      reviewCount
      genres { name }
    }
  }
`;

export const MOVIE_DETAIL_QUERY = `
  query MovieDetail($id: Int!) {
    movieById(id: $id) {
      id
      title
      synopsis
      releaseYear
      durationMinutes
      averageRating
      reviewCount
      genres { name }
      cast {
        role
        character
        person { name }
      }
      reviews {
        author
        rating
        comment
      }
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      name
    }
  }
`;

export const ADD_REVIEW_MUTATION = `
  mutation AddReview($movieId: Int!, $author: String!, $rating: Int!, $comment: String) {
    addReview(input: { movieId: $movieId, author: $author, rating: $rating, comment: $comment }) {
      id
    }
  }
`;

export const ADD_MOVIE_MUTATION = `
  mutation AddMovie($title: String!, $synopsis: String!, $year: Int!, $duration: Int!) {
    addMovie(input: { title: $title, synopsis: $synopsis, releaseYear: $year, durationMinutes: $duration }) {
      id
      title
    }
  }
`;
