"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SwapInterface } from "@/components/SwapInterface";
import { OffersList } from "@/components/OffersList";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <SwapInterface />
      <OffersList />
      <Footer />
    </main>
  );
}
