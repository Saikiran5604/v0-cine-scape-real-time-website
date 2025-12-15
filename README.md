# CineScape - Real-time Movie Recommendation Platform

A full-stack Next.js application for discovering movies with real-time trending updates, personalized recommendations, and user watchlists.

## Features

- **Trending Movies**: Real-time updates of trending movies powered by TMDB API
- **Search & Discovery**: Search movies by keywords with detailed information
- **User Authentication**: Secure authentication using Supabase Auth
- **Watchlist Management**: Save and organize movies for later watching
- **Personalized Recommendations**: Smart suggestions based on collaborative filtering
- **Movie Details**: Comprehensive info including cast, trailers, ratings, and budget
- **Real-time Updates**: Socket.io-based notifications for new trending movies
- **Dark Cinematic Theme**: Beautiful UI optimized for movie browsing

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Socket.io
- **External API**: TMDB (The Movie Database)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A TMDB API key (free from https://www.themoviedb.org/settings/api)
- A Supabase project (free tier available)

### Installation

1. **Clone and setup the project**:
   \`\`\`bash
   git clone <your-repo>
   cd cinescape
   npm install
   \`\`\`

2. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your TMDB API access token
   - Add your Supabase credentials

3. **Setup Supabase Database**:
   - Go to your Supabase project
   - Run the SQL script from `scripts/01-setup-schema.sql` in the SQL editor
   - Run `scripts/02-fix-rls-movies.sql` to enable RLS on movies table
   - This creates all necessary tables and RLS policies

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   - Open http://localhost:3000 in your browser

### Real-time Updates (Optional)

For real-time movie trending updates:

1. **Start the Socket.io server** (in a separate terminal):
   \`\`\`bash
   node scripts/socket-server.js
   \`\`\`
   This runs on port 3001 by default

2. **For production**, deploy the Socket.io server separately or use a managed WebSocket service

## Project Structure

```bash
cinescape/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Landing page with trending movies
│   ├── movie/[id]/          # Movie details page
│   ├── search/              # Search results page
│   ├── auth/                # Login & signup pages
│   ├── watchlist/           # User watchlist page
│   ├── recommendations/     # Personalized recommendations
│   ├── profile/             # User profile page
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout with Socket.io
├── components/              # React components
│   ├── ui/                  # shadcn UI components
│   ├── header.tsx           # Navigation header
│   ├── movie-card.tsx       # Movie grid card
│   ├── search-bar.tsx       # Search component
│   ├── movie-details-hero.tsx       # Movie details hero
│   ├── movie-details-content.tsx    # Movie details content
│   └── trending-updates.tsx         # Real-time notification
├── lib/                     # Utilities and helpers
│   ├── tmdb.ts              # TMDB API client
│   ├── supabase-client.ts   # Supabase browser client
│   ├── supabase-server.ts   # Supabase server client
│   ├── socket.ts            # Socket.io client
│   └── api-client.ts        # API request helpers
├── scripts/                 # Utility scripts
│   ├── 01-setup-schema.sql  # Database schema
│   ├── 02-fix-rls-movies.sql # Fix RLS on movies table
│   └── socket-server.js     # Socket.io server
└── public/                  # Static assets
```


## Database Schema

### Tables
- **movies**: Movie information from TMDB
- **users**: User profiles with usernames and avatars
- **watchlist**: Movies saved by users
- **ratings**: User movie ratings and reviews
- **recommendations**: Personalized movie suggestions
- **trending_movies**: Real-time trending data

All tables have Row-Level Security (RLS) enabled to protect user privacy.

## API Endpoints

### Movies
- `GET /api/movies?action=trending&time=day|week` - Trending movies
- `GET /api/movies?action=watchlist` - User's watchlist
- `POST /api/movies` - Rate a movie

### Recommendations
- `GET /api/recommendations` - Personalized recommendations

### Trending
- `GET /api/trending?time=day|week` - Real-time trending updates

### Authentication
- `POST /api/auth` - Login/signup

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**:
   - Go to vercel.com and sign in
   - Click "New Project" and import your GitHub repo
   - Configure environment variables
   - Click "Deploy"

3. **Set Environment Variables in Vercel**:
   - Go to Settings > Environment Variables
   - Add: `TMDB_ACCESS_TOKEN` (your TMDB API access token)
   - Add: `NEXT_PUBLIC_SUPABASE_URL`
   - Add: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add: `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (set to your Vercel URL)

### Deploy Socket.io Server

For production real-time updates, options include:

1. **Railway.app** (recommended):
   - Push to GitHub
   - Connect Railway to your repo
   - Set environment variables
   - Deploy

2. **Heroku**:
   - `heroku create cinescape-socket`
   - `git push heroku main`

3. **AWS/DigitalOcean**:
   - Deploy Node.js server manually or via Docker

## Performance Optimizations

- **Image Optimization**: TMDB images cached for 30 days
- **API Caching**: TMDB requests cached with Next.js `revalidate`
- **Database Indexing**: Optimized queries with database indexes
- **Component Splitting**: Lazy loading and code splitting
- **Security Headers**: CSP, X-Frame-Options, and more

## Troubleshooting

### Authentication Issues

See `AUTH_TROUBLESHOOTING.md` for detailed solutions to:
- Email rate limit exceeded errors
- Users unable to login after signup
- Email confirmation setup
- RLS warnings and security

**Quick Fix**: Disable email confirmation in Supabase Dashboard (Authentication → Providers → Email → Toggle OFF "Confirm email")

### TMDB API Issues

- Verify `TMDB_ACCESS_TOKEN` is set in environment variables
- Check the token has correct permissions
- App uses demo data as fallback if API unavailable

### Supabase Connection Issues

- Verify all environment variables are set correctly
- Check Supabase project is active and not paused
- Review RLS policies if data isn't loading
- Run both SQL migration scripts in order

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Open an issue on GitHub
- Check the TMDB API documentation
- Review Supabase docs at supabase.com

## Acknowledgments

- TMDB for the movie data API
- Supabase for authentication and database
- Vercel for hosting and deployment
- shadcn/ui for beautiful components

## Contributors
- D SAIKIRAN REDDY
- SAHANA GOWDA B
