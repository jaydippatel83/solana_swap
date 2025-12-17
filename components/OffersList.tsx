"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SolanaSwap } from "@/types/solana_swap";
import IDL from "@/idl/solana_swap.json";

const PROGRAM_ID = new PublicKey("HtWA1QfHSwU5paq3vLkZ5yarZqVENat54VhULYTJCpUh");

interface Offer {
  publicKey: PublicKey;
  account: {
    id: BN;
    maker: PublicKey;
    tokenMintA: PublicKey;
    tokenMintB: PublicKey;
    tokenBWantedAmount: BN;
    bump: number;
  };
}

export function OffersList() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [takingOffer, setTakingOffer] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      if (!wallet.publicKey) return;

      const provider = new AnchorProvider(
        connection,
        wallet as any,
        AnchorProvider.defaultOptions()
      );

      const program = new Program<SolanaSwap>(IDL as SolanaSwap, provider);

      const allOffers = await program.account.offer.all();
      setOffers(allOffers as Offer[]);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const takeOffer = async (offer: Offer) => {
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setTakingOffer(offer.publicKey.toString());

    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        AnchorProvider.defaultOptions()
      );

      const program = new Program<SolanaSwap>(IDL as SolanaSwap, provider);

      const takerTokenAccountA = getAssociatedTokenAddressSync(
        offer.account.tokenMintA,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      const takerTokenAccountB = getAssociatedTokenAddressSync(
        offer.account.tokenMintB,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      const makerTokenAccountB = getAssociatedTokenAddressSync(
        offer.account.tokenMintB,
        offer.account.maker,
        false,
        TOKEN_PROGRAM_ID
      );

      const vault = getAssociatedTokenAddressSync(
        offer.account.tokenMintA,
        offer.publicKey,
        true,
        TOKEN_PROGRAM_ID
      );

      const tx = await program.methods
        .takeOffer()
        .accounts({
          taker: wallet.publicKey,
          maker: offer.account.maker,
          tokenMintA: offer.account.tokenMintA,
          tokenMintB: offer.account.tokenMintB,
          takerTokenAccountA,
          takerTokenAccountB,
          makerTokenAccountB,
          offer: offer.publicKey,
          vault,
          systemProgram: PublicKey.default,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: new PublicKey(
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          ),
        })
        .rpc();

      alert("Offer taken successfully!");
      fetchOffers(); // Refresh offers
    } catch (error) {
      console.error("Error taking offer:", error);
      alert("Failed to take offer. Check console for details.");
    } finally {
      setTakingOffer(null);
    }
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchOffers();
      const interval = setInterval(fetchOffers, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [wallet.connected]);

  return (
    <section id="offers" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Active Offers</span>
          </h2>
          <p className="text-gray-400">
            Browse and take available token swap offers
          </p>
        </div>

        {!wallet.connected ? (
          <div className="text-center glass rounded-2xl p-12">
            <p className="text-gray-400">
              Connect your wallet to view offers
            </p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center glass rounded-2xl p-12">
            <p className="text-gray-400">
              No active offers yet. Create the first one!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.publicKey.toString()}
                className="glass rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Offer ID</div>
                  <div className="text-xl font-bold">
                    #{offer.account.id.toString()}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="text-sm text-gray-400">Offering</div>
                    <div className="text-sm font-mono text-purple-400 truncate">
                      {offer.account.tokenMintA.toString()}
                    </div>
                  </div>

                  <div className="text-center text-gray-500">⇅</div>

                  <div>
                    <div className="text-sm text-gray-400">Wants</div>
                    <div className="text-sm font-mono text-green-400 truncate">
                      {offer.account.tokenMintB.toString()}
                    </div>
                    <div className="text-lg font-semibold mt-1">
                      {(offer.account.tokenBWantedAmount.toNumber() / 1_000_000).toFixed(6)} tokens
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-xs text-gray-500">
                  <div className="truncate">
                    Maker: {offer.account.maker.toString()}
                  </div>
                </div>

                <button
                  onClick={() => takeOffer(offer)}
                  disabled={
                    takingOffer === offer.publicKey.toString() ||
                    offer.account.maker.equals(wallet.publicKey!)
                  }
                  className="w-full py-3 rounded-xl bg-gradient-solana text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {offer.account.maker.equals(wallet.publicKey!)
                    ? "Your Offer"
                    : takingOffer === offer.publicKey.toString()
                    ? "Taking..."
                    : "Take Offer"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

