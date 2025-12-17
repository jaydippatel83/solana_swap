"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CreateOfferForm } from "./CreateOfferForm";

export function SwapInterface() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<"create" | "take">("create");

  return (
    <section id="swap" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-3xl p-8 border border-gray-800">
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeTab === "create"
                  ? "bg-gradient-solana text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Create Offer
            </button>
            <button
              onClick={() => setActiveTab("take")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeTab === "take"
                  ? "bg-gradient-solana text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Take Offer
            </button>
          </div>

          {!connected ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                Connect your wallet to start trading
              </p>
              <div className="text-5xl mb-4">🔒</div>
            </div>
          ) : (
            <>
              {activeTab === "create" && <CreateOfferForm />}
              {activeTab === "take" && (
                <div className="text-center py-8 text-gray-400">
                  Select an offer from the list below to take it
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

