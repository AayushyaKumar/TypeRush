import Link from "next/link"

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24 flex flex-col items-center text-center">
     

      {/* Hero Typography */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-4 sm:mb-6">
        Master Your Keyboard, <br />
        <span className="gradient-text">Dominate the Leaderboard</span>
      </h1>
      
      <p className="text-muted-foreground max-w-xl mb-8 sm:mb-12 text-sm sm:text-base md:text-lg leading-relaxed">
        Test your fingers in solo practice, challenge friends in high-stakes multiplayer typing races, and track your WPM speed evolution.
      </p>

      {/* Mode Selection Cards */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl mb-10 sm:mb-16">
        {/* Practice card */}
        <div className="glass-panel glass-panel-hover flex flex-col text-left group">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
            🎯
          </div>
          <h3 className="text-xl font-bold mb-2">Practice Solo</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-grow">
            Sharpen your muscle memory. Filter by difficulty level, words count, and race against the clock without pressure.
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary text-foreground font-semibold rounded-xl text-sm hover:bg-primary hover:text-primary-foreground transition-all w-full text-center"
          >
            Start Practice →
          </Link>
        </div>

        {/* Multiplayer card */}
        <div className="glass-panel glass-panel-hover flex flex-col text-left group">
          <div className="w-12 h-12 rounded-xl bg-chart-2/15 text-chart-2 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
            🏎️
          </div>
          <h3 className="text-xl font-bold mb-2">Multiplayer Arena</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-grow">
            Go head-to-head with up to 6 players. Create lobby codes, share them, and watch progress updates live as you type.
          </p>
          <Link
            href="/race"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 shadow-lg shadow-primary/10 transition-all w-full text-center"
          >
            Enter Arena →
          </Link>
        </div>
      </div>

      {/* Features Overview */}
      <div className="w-full max-w-4xl border-t border-border pt-12">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-8">
          Built For Speed Enthusiasts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">⚡ Real-Time WebSockets</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Powered by Socket.io, see cars zoom across the screen tracking your competitors&apos; live positions character by character.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">🛡️ Guest or Auth Mode</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Play instantly as a guest, or sign in with Google to preserve your achievements and race outcomes permanently in the cloud.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}