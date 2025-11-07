"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface WatchlistItem {
  id: number
  movie_id: number
  movie_title: string
  movie_poster: string | null
  added_at: string
}

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      const { data: watchlist, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching watchlist:", error)
        setIsLoading(false)
        return
      }

      console.log("[v0] Watchlist items:", watchlist)
      setWatchlistItems(watchlist || [])
      setIsLoading(false)
    }

    fetchWatchlist()
  }, [supabase, router])

  const handleRemove = async (movieId: number) => {
    try {
      await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)

      setWatchlistItems(watchlistItems.filter((item) => item.movie_id !== movieId))
    } catch (error) {
      console.error("[v0] Error removing from watchlist:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Watchlist</h1>
        <p className="text-muted-foreground mb-8">
          {watchlistItems.length} {watchlistItems.length === 1 ? "movie" : "movies"} saved
        </p>

        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlistItems.map((item) => (
              <div key={item.id} className="group relative">
                <Link href={`/movie/${item.movie_id}`}>
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                    {item.movie_poster ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${item.movie_poster}`}
                        alt={item.movie_title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No image</p>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-foreground font-medium line-clamp-2">{item.movie_title}</h3>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(item.movie_id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
            <Link href="/">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
