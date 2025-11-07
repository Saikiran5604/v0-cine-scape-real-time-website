import { type NextRequest, NextResponse } from "next/server"
import { getMovieDetails } from "@/lib/tmdb"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("[v0] API Route START - Params:", params)

  try {
    const movieId = Number.parseInt(params.id)

    if (isNaN(movieId)) {
      console.error("[v0] API Route: Invalid movie ID:", params.id)
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    console.log("[v0] API Route: Fetching movie details for ID:", movieId)

    const movie = await getMovieDetails(movieId)

    console.log("[v0] API Route: getMovieDetails returned:", movie ? "Movie data" : "null")

    if (!movie) {
      console.error("[v0] API Route: Movie not found for ID:", movieId)
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    if (!movie.id || !movie.title) {
      console.error("[v0] API Route: Invalid movie data structure:", movie)
      return NextResponse.json({ error: "Invalid movie data" }, { status: 500 })
    }

    console.log("[v0] API Route: Successfully returning movie:", movie.title, "ID:", movie.id)

    return NextResponse.json(movie, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("[v0] API Route: Unhandled error:", error)
    console.error("[v0] API Route: Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      { error: "Failed to fetch movie details", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
