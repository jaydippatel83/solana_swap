"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SwapInterface } from "@/components/SwapInterface";
import { OffersList } from "@/components/OffersList";
import { TokenManager } from "@/components/TokenManager";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      
      {/* Token Manager Section */}
      <section id="tokens" className="py-20 px-4 bg-gradient-to-b from-black to-purple-900/10">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Token Manager</span>
          </h2>
          <p className="text-gray-400">
            Create tokens, accounts, and mint - all from the UI!
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <TokenManager />
        </div>
      </section>

      <SwapInterface />
      <OffersList />
      <Footer />
    </main>
  );
}
