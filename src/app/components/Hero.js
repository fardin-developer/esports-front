'use client'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center text-center px-4 relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 shimmer">
          Level Up Your Gaming
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
          Get instant diamonds, coins, and premium currency for your favorite games at unbeatable prices with our secure wallet system.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/games"
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-bg rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            🎮 Browse Games
          </Link>
          <Link
            href="/wallet"
            className="px-8 py-4 text-primary border-2 border-primary rounded-full hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            💳 Add Balance
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero