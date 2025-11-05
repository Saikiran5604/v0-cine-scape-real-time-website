import { Button } from "@/components/ui/button"
import Link from "next/link"

const trendingMovies = [
  {
    id: 1,
    title: "The Cinematic Revolution",
    overview: "A groundbreaking film about cinema itself",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-01-15",
    vote_average: 8.5,
  },
  {
    id: 2,
    title: "Digital Dreams",
    overview: "An exploration of virtual reality and human connection",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-02-20",
    vote_average: 7.9,
  },
  {
    id: 3,
    title: "Beyond Horizons",
    overview: "Epic space adventure with stunning visuals",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-03-10",
    vote_average: 8.2,
  },
  {
    id: 4,
    title: "Urban Legends",
    overview: "Mysterious tale set in a modern metropolis",
    poster_path: "/movie-poster.jpg",
    release_date: "2024-04-05",
    vote_average: 7.7,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                CineScape
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Discover
              </Link>
              <Link href="/search" className="text-foreground hover:text-primary transition-colors font-medium">
                Search
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Favorite Movie
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Experience personalized recommendations powered by real-time trending data. Build your watchlist, rate
              movies, and connect with cinema.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base font-semibold"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="#trending">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold bg-transparent">
                  Browse Movies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section id="trending" className="py-20 md:py-32 bg-gradient-to-b from-background via-card/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Trending This Week</h2>
            <p className="text-lg text-muted-foreground">Discover what millions are watching right now</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full rounded-xl border border-border bg-card hover:border-primary/50 hover:-translate-y-1">
                  <div className="relative group">
                    <img
                      src={movie.poster_path || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-foreground text-sm line-clamp-3 font-medium">{movie.overview}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 text-base">{movie.title}</h3>
                    <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                      <span className="font-medium">{movie.release_date?.split("-")[0]}</span>
                      <span className="bg-accent/20 text-accent px-2 py-1 rounded-full font-semibold">
                        ★ {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 text-center">Why Choose CineScape</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <div className="text-6xl mb-6 inline-block p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                📽️
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Real-Time Updates</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get instant notifications when new movies start trending. Never miss a moment.
              </p>
            </div>

            <div className="group p-8 rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
              <div className="text-6xl mb-6 inline-block p-3 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                ⭐
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Smart Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Personalized suggestions based on your watchlist and ratings. Discover films you'll love.
              </p>
            </div>

            <div className="group p-8 rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <div className="text-6xl mb-6 inline-block p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                ❤️
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Your Watchlist</h3>
              <p className="text-muted-foreground leading-relaxed">
                Save movies you want to watch and track your favorites all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Explore?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers discovering their next favorite film.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base font-semibold"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
