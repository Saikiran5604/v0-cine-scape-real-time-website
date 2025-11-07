"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      console.log("[v0] Starting login process for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login response:", { data, error })

      if (error) {
        console.error("[v0] Login error:", error)
        if (error.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before logging in.")
        } else if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials.")
        } else {
          setError(error.message)
        }
        return
      }

      if (data.session && data.user) {
        console.log("[v0] Login successful, session created")

        try {
          const ensureUserResponse = await fetch("/api/users/ensure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user.id, email: data.user.email }),
          })

          if (ensureUserResponse.ok) {
            console.log("[v0] User record ensured in public.users table")
          } else {
            console.error("[v0] Failed to ensure user record")
          }
        } catch (userRecordError) {
          console.error("[v0] Exception ensuring user record:", userRecordError)
        }

        console.log("[v0] Redirecting to home page")
        window.location.href = "/"
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (err) {
      console.error("[v0] Login exception:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Welcome Back</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
