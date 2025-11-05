const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN
const TMDB_API_KEY = process.env.TMDB_API_KEY

const DEMO_MOVIES = [
  {
    id: 550,
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    poster_path: "/movie-poster.jpg",
    backdrop_path: "/movie-backdrop.jpg",
    release_date: "1999-10-15",
    vote_average: 8.8,
    vote_count: 26000,
    genre_ids: [18, 53],
    popularity: 75.5,
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: "/movie-poster.jpg",
    backdrop_path: "/movie-backdrop.jpg",
    release_date: "1994-10-14",
    vote_average: 9.3,
    vote_count: 25000,
    genre_ids: [18, 80],
    popularity: 85.0,
  },
  {
    id: 238,
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.",
    poster_path: "/movie-poster.jpg",
    backdrop_path: "/movie-backdrop.jpg",
    release_date: "1972-03-24",
    vote_average: 9.2,
    vote_count: 19000,
    genre_ids: [18, 80],
    popularity: 95.2,
  },
  {
    id: 240,
    title: "The Godfather Part II",
    overview:
      "The early life and career of Vito Corleone in 1920s New York is portrayed while his youngest son Michael expands and tightens his grip on the family crime syndicate.",
    poster_path: "/movie-poster.jpg",
    backdrop_path: "/movie-backdrop.jpg",
    release_date: "1974-12-20",
    vote_average: 9.0,
    vote_count: 17000,
    genre_ids: [18, 80],
    popularity: 88.5,
  },
  {
    id: 424,
    title: "Schindler's List",
    overview:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.",
    poster_path: "/movie-poster.jpg",
    backdrop_path: "/movie-backdrop.jpg",
    release_date: "1993-12-15",
    vote_average: 9.0,
    vote_count: 20000,
    genre_ids: [18, 36, 10752],
    popularity: 82.3,
  },
  {
    id: 389,
    title: "12 Angry Men",
    overview:
      "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    poster_path: "/movie-poster.jpg",
    backdrop_path: "/movie-backdrop.jpg",
    release_date: "1957-04-10",
    vote_average: 9.0,
    vote_count: 16000,
    genre_ids: [18, 80],
    popularity: 79.1,
  },
]

function hasValidApiKey(): boolean {
  const hasToken =
    TMDB_ACCESS_TOKEN && TMDB_ACCESS_TOKEN !== "your_tmdb_access_token_here" && TMDB_ACCESS_TOKEN?.trim() !== ""
  const hasKey = TMDB_API_KEY && TMDB_API_KEY !== "your_tmdb_api_key_here" && TMDB_API_KEY?.trim() !== ""
  return hasToken || hasKey
}

function getAuthHeader(): Record<string, string> {
  if (TMDB_ACCESS_TOKEN && TMDB_ACCESS_TOKEN.trim() !== "") {
    return {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    }
  }
  return {
    "Content-Type": "application/json;charset=utf-8",
  }
}

function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)

  if (TMDB_API_KEY && TMDB_API_KEY.trim() !== "") {
    url.searchParams.set("api_key", TMDB_API_KEY)
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return url.toString()
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface TrendingResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
  demo?: boolean
}

export async function getTrendingMovies(timeWindow: "day" | "week" = "day"): Promise<TrendingResponse> {
  try {
    if (!hasValidApiKey()) {
      console.warn("[CineScape] TMDB credentials not configured. Using demo data.")
      return { results: DEMO_MOVIES, page: 1, total_pages: 1, total_results: DEMO_MOVIES.length, demo: true }
    }

    const url = buildUrl(`/trending/movie/${timeWindow}`)
    const res = await fetch(url, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      console.error(`[CineScape] TMDB API error: ${res.status}`)
      throw new Error("Failed to fetch trending movies")
    }
    return res.json()
  } catch (error) {
    console.error("[CineScape] Trending movies error:", error)
    return { results: DEMO_MOVIES, page: 1, total_pages: 1, total_results: DEMO_MOVIES.length, demo: true }
  }
}

export async function searchMovies(query: string): Promise<TrendingResponse> {
  try {
    if (!hasValidApiKey()) {
      console.warn("[CineScape] TMDB credentials not configured. Using demo data.")
      const filtered = DEMO_MOVIES.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.overview.toLowerCase().includes(query.toLowerCase()),
      )
      return { results: filtered, page: 1, total_pages: 1, total_results: filtered.length, demo: true }
    }

    const url = buildUrl("/search/movie", { query, page: "1" })
    const res = await fetch(url, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      console.error(`[CineScape] TMDB API error: ${res.status}`)
      throw new Error("Failed to search movies")
    }
    return res.json()
  } catch (error) {
    console.error("[CineScape] Search movies error:", error)
    const filtered = DEMO_MOVIES.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase()),
    )
    return { results: filtered, page: 1, total_pages: 1, total_results: filtered.length, demo: true }
  }
}

export async function getMovieDetails(movieId: number) {
  try {
    if (!hasValidApiKey()) {
      const demoMovie = DEMO_MOVIES.find((m) => m.id === movieId)
      if (demoMovie) {
        return {
          ...demoMovie,
          budget: 63000000,
          revenue: 100853753,
          credits: {
            cast: [
              { id: 1, name: "Brad Pitt", character: "Tyler Durden", profile_path: null },
              { id: 2, name: "Edward Norton", character: "The Narrator", profile_path: null },
            ],
          },
          videos: {
            results: [{ id: "123", key: "BHE0Z7G5_54", type: "Trailer", site: "YouTube" }],
          },
        }
      }
      return null
    }

    const url = buildUrl(`/movie/${movieId}`, { append_to_response: "credits,videos" })
    const res = await fetch(url, {
      headers: getAuthHeader(),
      next: { revalidate: 86400 },
    })
    if (!res.ok) {
      console.error(`[CineScape] TMDB API error: ${res.status}`)
      throw new Error("Failed to fetch movie details")
    }
    return res.json()
  } catch (error) {
    console.error("[CineScape] Movie details error:", error)
    return null
  }
}

export function getPosterUrl(posterPath: string | null, size: "w342" | "w500" | "w780" = "w500"): string {
  if (!posterPath) return "/movie-poster.jpg"
  return `https://image.tmdb.org/t/p/${size}${posterPath}`
}

export function getBackdropUrl(backdropPath: string | null): string {
  if (!backdropPath) return "/movie-backdrop.jpg"
  return `https://image.tmdb.org/t/p/w1280${backdropPath}`
}
