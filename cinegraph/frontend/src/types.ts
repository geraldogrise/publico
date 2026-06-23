export interface Genre {
  name: string;
}

export interface Person {
  name: string;
}

export interface CastMember {
  role: 'ACTOR' | 'DIRECTOR';
  character: string;
  person: Person;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Movie {
  id: number;
  title: string;
  synopsis?: string;
  releaseYear: number;
  durationMinutes: number;
  averageRating: number;
  reviewCount: number;
  genres: Genre[];
  cast?: CastMember[];
  reviews?: Review[];
}
