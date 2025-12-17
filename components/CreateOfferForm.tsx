"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { SolanaSwap } from "@/types/solana_swap";
import IDL from "@/idl/solana_swap.json";

const PROGRAM_ID = new PublicKey("HtWA1QfHSwU5paq3vLkZ5yarZqVENat54VhULYTJCpUh");

export function CreateOfferForm() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [formData, setFormData] = useState({
    offerId: "",
    tokenMintA: "",
    tokenMintB: "",
    tokenAAmount: "",
    tokenBAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setLoading(true);
    setTxSignature("");

    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        AnchorProvider.defaultOptions()
      );

      const program = new Program<SolanaSwap>(
        IDL as SolanaSwap,
        provider
      );

      const tokenMintA = new PublicKey(formData.tokenMintA);
      const tokenMintB = new PublicKey(formData.tokenMintB);
      const id = new BN(formData.offerId);

      // Derive PDAs
      const [offerPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("offer"),
          wallet.publicKey.toBuffer(),
          id.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const makerTokenAccountA = getAssociatedTokenAddressSync(
        tokenMintA,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      const vault = getAssociatedTokenAddressSync(
        tokenMintA,
        offerPda,
        true,
        TOKEN_PROGRAM_ID
      );

      // Convert amounts to proper units (assuming 6 decimals)
      const tokenAOfferedAmount = new BN(
        parseFloat(formData.tokenAAmount) * 1_000_000
      );
      const tokenBWantedAmount = new BN(
        parseFloat(formData.tokenBAmount) * 1_000_000
      );

      const tx = await program.methods
        .makeOffer(id, tokenAOfferedAmount, tokenBWantedAmount)
        .accounts({
          maker: wallet.publicKey,
          tokenMintA,
          tokenMintB,
          makeTokenAccountA: makerTokenAccountA,
          offer: offerPda,
          vault,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: new PublicKey(
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          ),
        })
        .rpc();

      setTxSignature(tx);
      alert("Offer created successfully!");
      
      // Reset form
      setFormData({
        offerId: "",
        tokenMintA: "",
        tokenMintB: "",
        tokenAAmount: "",
        tokenBAmount: "",
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      alert("Failed to create offer. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Offer ID
        </label>
        <input
          type="number"
          value={formData.offerId}
          onChange={(e) =>
            setFormData({ ...formData, offerId: e.target.value })
          }
          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Token A Mint Address (You Offer)
        </label>
        <input
          type="text"
          value={formData.tokenMintA}
          onChange={(e) =>
            setFormData({ ...formData, tokenMintA: e.target.value })
          }
          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
          placeholder="Token mint address..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount to Offer
        </label>
        <input
          type="number"
          step="0.000001"
          value={formData.tokenAAmount}
          onChange={(e) =>
            setFormData({ ...formData, tokenAAmount: e.target.value })
          }
          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="1.0"
          required
        />
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="text-2xl text-gray-500">⇅</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Token B Mint Address (You Want)
        </label>
        <input
          type="text"
          value={formData.tokenMintB}
          onChange={(e) =>
            setFormData({ ...formData, tokenMintB: e.target.value })
          }
          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
          placeholder="Token mint address..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount You Want
        </label>
        <input
          type="number"
          step="0.000001"
          value={formData.tokenBAmount}
          onChange={(e) =>
            setFormData({ ...formData, tokenBAmount: e.target.value })
          }
          className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="2.0"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-solana text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? "Creating Offer..." : "Create Offer"}
      </button>

      {txSignature && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 rounded-xl">
          <p className="text-sm text-green-400 mb-2">Transaction successful!</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 break-all"
          >
            View on Explorer: {txSignature}
          </a>
        </div>
      )}
    </form>
  );
}

