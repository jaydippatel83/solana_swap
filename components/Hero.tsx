"use client";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-solana-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-solana-green/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
          The Decentralized
          <br />
          <span className="gradient-text">Token Exchange</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto animate-fade-in">
          Trade SPL tokens peer-to-peer with zero intermediaries. Fast, secure,
          and powered by Solana.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <a
            href="#tokens"
            className="px-8 py-4 rounded-full bg-gradient-solana text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1"
          >
            Create Tokens
          </a>
          <a
            href="#swap"
            className="px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/10 transition-all"
          >
            Start Trading
          </a>
          <a
            href="#offers"
            className="px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/10 transition-all"
          >
            View Offers
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold gradient-text">Fast</div>
            <div className="text-gray-400 mt-2">400ms Transactions</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold gradient-text">Secure</div>
            <div className="text-gray-400 mt-2">On-Chain Escrow</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold gradient-text">Low Cost</div>
            <div className="text-gray-400 mt-2">~$0.00025 Fee</div>
          </div>
        </div>
      </div>
    </section>
  );
}

