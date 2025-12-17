"use client";

import dynamic from "next/dynamic";
import { ClientOnly } from "./ClientOnly";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-solana flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <span className="text-2xl font-bold gradient-text">
              Solana Swap
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#tokens"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Tokens
            </a>
            <a
              href="#swap"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Swap
            </a>
            <a
              href="#offers"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Offers
            </a>
          </nav>

          <ClientOnly>
            <WalletMultiButtonDynamic />
          </ClientOnly>
        </div>
      </div>
    </header>
  );
}

