"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { MovieDetailsHero } from "@/components/movie-details-hero"
import { MovieDetailsContent } from "@/components/movie-details-content"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MovieDetailPage() {
  const params = useParams()
  const movieId = Number.parseInt(params.id as string)
  const [movie, setMovie] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      console.log("[v0] Fetching movie details for ID:", movieId)
      setIsLoading(true)

      try {
        const response = await fetch(`/api/movies/${movieId}`)

        if (!response.ok) {
          console.error("[v0] API response not OK:", response.status, response.statusText)
          const errorData = await response.json().catch(() => ({}))
          console.error("[v0] Error data:", errorData)
          setMovie(null)
          setIsLoading(false)
          return
        }

        const movieData = await response.json()
        console.log("[v0] Movie data received:", movieData)

        if (movieData && movieData.id && !movieData.error) {
          console.log("[v0] Setting movie state with:", movieData.title)
          setMovie(movieData)
        } else {
          console.error("[v0] Invalid movie data format or contains error:", movieData)
          setMovie(null)
        }
      } catch (error) {
        console.error("[v0] Error fetching movie:", error)
        setMovie(null)
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        console.log("[v0] User:", user ? "logged in" : "not logged in")
        setUser(user)

        if (user && movieId) {
          const { data: watchlist } = await supabase
            .from("watchlist")
            .select("*")
            .eq("user_id", user.id)
            .eq("movie_id", movieId)
            .single()

          console.log("[v0] Watchlist check:", watchlist ? "in watchlist" : "not in watchlist")
          setIsInWatchlist(!!watchlist)
        }
      } catch (error) {
        console.error("[v0] Error checking user/watchlist:", error)
      }

      setIsLoading(false)
    }

    if (movieId) {
      fetchData()
    }
  }, [movieId])

  const handleWatchlistToggle = async () => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    try {
      if (isInWatchlist) {
        const { error } = await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)

        if (error) {
          console.error("[v0] Error removing from watchlist:", error)
          setWatchlistMessage("Failed to remove from watchlist")
          return
        }

        setIsInWatchlist(false)
        setWatchlistMessage("Removed from watchlist!")
        console.log("[v0] Successfully removed from watchlist")
      } else {
        const ensureUserResponse = await fetch("/api/users/ensure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, email: user.email }),
        })

        if (!ensureUserResponse.ok) {
          console.error("[v0] Failed to ensure user exists")
          setWatchlistMessage("Failed to add to watchlist. Please try again.")
          setTimeout(() => setWatchlistMessage(null), 3000)
          return
        }

        const { error: movieInsertError } = await supabase.from("movies").upsert(
          {
            id: movieId,
            tmdb_id: movieId,
            title: movie.title || "Unknown Title",
            description: movie.overview || null,
            poster_path: movie.poster_path || null,
            backdrop_path: movie.backdrop_path || null,
            release_date: movie.release_date || null,
            rating: movie.vote_average || null,
            vote_count: movie.vote_count || null,
            genre_ids: movie.genres ? movie.genres.map((g: any) => g.id) : [],
            popularity: movie.popularity || null,
          },
          {
            onConflict: "id",
          },
        )

        if (movieInsertError) {
          console.error("[v0] Error inserting movie:", movieInsertError)
          setWatchlistMessage("Failed to add to watchlist")
          setTimeout(() => setWatchlistMessage(null), 3000)
          return
        }

        const { error } = await supabase.from("watchlist").insert({
          user_id: user.id,
          movie_id: movieId,
        })

        if (error) {
          console.error("[v0] Error adding to watchlist:", error)
          setWatchlistMessage("Failed to add to watchlist")
          return
        }

        setIsInWatchlist(true)
        setWatchlistMessage("Added to watchlist!")
        console.log("[v0] Successfully added to watchlist")
      }

      setTimeout(() => setWatchlistMessage(null), 3000)
    } catch (error) {
      console.error("[v0] Error updating watchlist:", error)
      setWatchlistMessage("An error occurred")
      setTimeout(() => setWatchlistMessage(null), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-muted-foreground mt-4">Loading movie details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
            <p className="text-muted-foreground mb-6">
              The movie you're looking for doesn't exist or couldn't be loaded.
            </p>
            <p className="text-sm text-muted-foreground mb-8">Movie ID: {movieId}</p>
            <Link href="/">
              <Button size="lg">Go Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {watchlistMessage && (
          <div className="mb-4 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <p className="text-foreground font-medium">{watchlistMessage}</p>
          </div>
        )}

        <MovieDetailsHero
          movie={movie}
          isInWatchlist={isInWatchlist}
          onWatchlistToggle={user ? handleWatchlistToggle : undefined}
          isLoading={isLoading}
        />

        <MovieDetailsContent movie={movie} genres={movie.genres || []} />
      </div>
    </div>
  )
}
