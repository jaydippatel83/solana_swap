"use client";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-solana flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                Solana Swap
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Decentralized peer-to-peer token exchange on Solana.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#swap" className="hover:text-white transition-colors">
                  Swap Tokens
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-white transition-colors">
                  View Offers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://docs.solana.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.solana.com/?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Explorer
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Network</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-400">Devnet Active</span>
              </div>
              <div className="text-gray-500">
                Program ID:
                <div className="text-xs font-mono break-all mt-1">
                  HtWA1QfHSwU5paq3vLkZ5yarZqVENat54VhULYTJCpUh
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 Solana Swap. Built on Solana.</p>
        </div>
      </div>
    </footer>
  );
}

