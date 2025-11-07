"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Rating {
  id: number
  movie_id: number
  rating: number
  created_at: string
}

const cinematicQuotes = [
  {
    quote: "Here's looking at you, kid.",
    movie: "Casablanca",
    year: "1942",
  },
  {
    quote: "May the Force be with you.",
    movie: "Star Wars",
    year: "1977",
  },
  {
    quote: "I'm going to make him an offer he can't refuse.",
    movie: "The Godfather",
    year: "1972",
  },
  {
    quote: "You talking to me?",
    movie: "Taxi Driver",
    year: "1976",
  },
  {
    quote: "Life is like a box of chocolates. You never know what you're gonna get.",
    movie: "Forrest Gump",
    year: "1994",
  },
  {
    quote: "I'll be back.",
    movie: "The Terminator",
    year: "1984",
  },
  {
    quote: "Why so serious?",
    movie: "The Dark Knight",
    year: "2008",
  },
  {
    quote: "Just keep swimming.",
    movie: "Finding Nemo",
    year: "2003",
  },
  {
    quote: "There's no place like home.",
    movie: "The Wizard of Oz",
    year: "1939",
  },
  {
    quote: "I see dead people.",
    movie: "The Sixth Sense",
    year: "1999",
  },
]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [randomQuote, setRandomQuote] = useState(cinematicQuotes[0])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const quote = cinematicQuotes[Math.floor(Math.random() * cinematicQuotes.length)]
    setRandomQuote(quote)

    const fetchProfile = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Fetch user profile
      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single()

      setProfile(profileData)
      setIsLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-8 md:p-12 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 text-9xl font-serif text-primary">"</div>
            <div className="absolute bottom-4 right-4 text-9xl font-serif text-accent rotate-180">"</div>
          </div>

          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-serif italic text-foreground mb-6 text-center leading-relaxed">
              {randomQuote.quote}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-primary/50" />
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                {randomQuote.movie} <span className="text-primary">({randomQuote.year})</span>
              </p>
              <div className="h-px w-12 bg-primary/50" />
            </div>
          </div>
        </div>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Email</p>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-2">Username</p>
              <p className="text-foreground font-medium">{profile?.username || "Not set"}</p>
            </div>

            <div className="pt-6">
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
