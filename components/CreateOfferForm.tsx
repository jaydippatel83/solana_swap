"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
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
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setLoading(true);
    setTxSignature("");
    setError("");

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

      // Check if token account exists
      const makerTokenAccountA = getAssociatedTokenAddressSync(
        tokenMintA,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      const accountInfo = await connection.getAccountInfo(makerTokenAccountA);
      if (!accountInfo) {
        setError(
          `Token account for Token A doesn't exist. Please create it first using:\nspl-token create-account ${formData.tokenMintA}`
        );
        setLoading(false);
        return;
      }

      // Derive PDAs
      const [offerPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("offer"),
          wallet.publicKey.toBuffer(),
          id.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
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
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      setTxSignature(tx);
      
      // Reset form
      setFormData({
        offerId: "",
        tokenMintA: "",
        tokenMintB: "",
        tokenAAmount: "",
        tokenBAmount: "",
      });
    } catch (error: any) {
      console.error("Error creating offer:", error);
      
      if (error.message?.includes("AccountNotInitialized")) {
        setError(
          "Token account not found. Please create a token account for Token A first.\n\nUsing CLI: spl-token create-account <TOKEN_MINT_ADDRESS>"
        );
      } else {
        setError(error.message || "Failed to create offer. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Instructions */}
      <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-xl">
        <p className="text-sm text-blue-400 font-semibold mb-2">⚠️ Before creating an offer:</p>
        <ol className="text-xs text-blue-300 space-y-1 list-decimal list-inside">
          <li>Make sure you have a token account for Token A</li>
          <li>Make sure you have enough Token A balance</li>
          <li>Run: <code className="bg-black/30 px-1 py-0.5 rounded">spl-token create-account {'<MINT>'}</code></li>
        </ol>
      </div>

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

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
          <p className="text-sm text-red-400 font-semibold mb-2">❌ Error</p>
          <p className="text-xs text-red-300 whitespace-pre-line">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-solana text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? "Creating Offer..." : "Create Offer"}
      </button>

      {txSignature && (
        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-xl">
          <p className="text-sm text-green-400 mb-2">✅ Transaction successful!</p>
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

