"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAccount,
} from "@solana/spl-token";

export function TokenManager() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [activeTab, setActiveTab] = useState<"create" | "account" | "mint">("create");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [error, setError] = useState("");

  // Create Token state
  const [tokenDecimals, setTokenDecimals] = useState("6");
  const [createdMint, setCreatedMint] = useState("");

  // Create Account state
  const [mintAddress, setMintAddress] = useState("");
  const [createdAccount, setCreatedAccount] = useState("");

  // Mint Tokens state
  const [mintToAddress, setMintToAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setLoading(true);
    setError("");
    setTxSignature("");
    setCreatedMint("");

    try {
      const mintKeypair = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(
          mintKeypair.publicKey,
          parseInt(tokenDecimals),
          wallet.publicKey,
          wallet.publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      transaction.partialSign(mintKeypair);
      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      setTxSignature(signature);
      setCreatedMint(mintKeypair.publicKey.toString());
    } catch (err: any) {
      console.error("Error creating token:", err);
      setError(err.message || "Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setLoading(true);
    setError("");
    setTxSignature("");
    setCreatedAccount("");

    try {
      const mint = new PublicKey(mintAddress);
      const associatedToken = getAssociatedTokenAddressSync(
        mint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Check if account already exists
      try {
        await getAccount(connection, associatedToken, "confirmed", TOKEN_PROGRAM_ID);
        setError("Token account already exists!");
        setCreatedAccount(associatedToken.toString());
        setLoading(false);
        return;
      } catch {
        // Account doesn't exist, create it
      }

      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mint,
          TOKEN_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      setTxSignature(signature);
      setCreatedAccount(associatedToken.toString());
    } catch (err: any) {
      console.error("Error creating account:", err);
      setError(err.message || "Failed to create token account");
    } finally {
      setLoading(false);
    }
  };

  const handleMintTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      const mint = new PublicKey(mintToAddress);
      const associatedToken = getAssociatedTokenAddressSync(
        mint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Get mint info to determine decimals
      const mintInfo = await connection.getParsedAccountInfo(mint);
      const decimals = (mintInfo.value?.data as any).parsed.info.decimals;

      const amount = parseFloat(mintAmount) * Math.pow(10, decimals);

      const transaction = new Transaction().add(
        createMintToInstruction(
          mint,
          associatedToken,
          wallet.publicKey,
          amount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      setTxSignature(signature);
    } catch (err: any) {
      console.error("Error minting tokens:", err);
      setError(err.message || "Failed to mint tokens");
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="text-center py-12 glass rounded-2xl p-8">
        <div className="text-5xl mb-4">🔒</div>
        <p className="text-gray-400">Connect your wallet to manage tokens</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 border border-gray-800">
      <h2 className="text-2xl font-bold gradient-text mb-6">Token Manager</h2>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === "create"
              ? "bg-gradient-solana text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Create Token
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === "account"
              ? "bg-gradient-solana text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Create Account
        </button>
        <button
          onClick={() => setActiveTab("mint")}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === "mint"
              ? "bg-gradient-solana text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Mint Tokens
        </button>
      </div>

      {/* Create Token Form */}
      {activeTab === "create" && (
        <form onSubmit={handleCreateToken} className="space-y-6">
          <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-xl">
            <p className="text-sm text-blue-400 font-semibold mb-2">ℹ️ Create New Token</p>
            <p className="text-xs text-blue-300">
              This will create a new SPL token mint on Solana Devnet. You will be the mint authority.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Decimals
            </label>
            <input
              type="number"
              value={tokenDecimals}
              onChange={(e) => setTokenDecimals(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
              min="0"
              max="9"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Typically 6 or 9 (like SOL)</p>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
              <p className="text-sm text-red-400">❌ {error}</p>
            </div>
          )}

          {createdMint && (
            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-xl">
              <p className="text-sm text-green-400 font-semibold mb-2">✅ Token Created!</p>
              <p className="text-xs text-gray-300 mb-1">Mint Address:</p>
              <p className="text-xs text-green-300 font-mono break-all">{createdMint}</p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(createdMint);
                  alert("Copied to clipboard!");
                }}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                📋 Copy Address
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-solana text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Token..." : "Create Token Mint"}
          </button>

          {txSignature && (
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-blue-400 hover:text-blue-300"
            >
              View Transaction
            </a>
          )}
        </form>
      )}

      {/* Create Account Form */}
      {activeTab === "account" && (
        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-xl">
            <p className="text-sm text-blue-400 font-semibold mb-2">ℹ️ Create Token Account</p>
            <p className="text-xs text-blue-300">
              Create an associated token account to hold tokens for a specific mint.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Token Mint Address
            </label>
            <input
              type="text"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
              placeholder="Paste token mint address..."
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
              <p className="text-sm text-red-400">❌ {error}</p>
            </div>
          )}

          {createdAccount && (
            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-xl">
              <p className="text-sm text-green-400 font-semibold mb-2">✅ Account Created!</p>
              <p className="text-xs text-gray-300 mb-1">Account Address:</p>
              <p className="text-xs text-green-300 font-mono break-all">{createdAccount}</p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(createdAccount);
                  alert("Copied to clipboard!");
                }}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                📋 Copy Address
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-solana text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Token Account"}
          </button>

          {txSignature && (
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-blue-400 hover:text-blue-300"
            >
              View Transaction
            </a>
          )}
        </form>
      )}

      {/* Mint Tokens Form */}
      {activeTab === "mint" && (
        <form onSubmit={handleMintTokens} className="space-y-6">
          <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-xl">
            <p className="text-sm text-blue-400 font-semibold mb-2">ℹ️ Mint Tokens</p>
            <p className="text-xs text-blue-300">
              Mint tokens to your account. You must be the mint authority.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Token Mint Address
            </label>
            <input
              type="text"
              value={mintToAddress}
              onChange={(e) => setMintToAddress(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
              placeholder="Paste token mint address..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount to Mint
            </label>
            <input
              type="number"
              step="0.000001"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="10"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
              <p className="text-sm text-red-400">❌ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-solana text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Minting..." : "Mint Tokens"}
          </button>

          {txSignature && (
            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-xl">
              <p className="text-sm text-green-400 mb-2">✅ Tokens Minted!</p>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 break-all"
              >
                View Transaction
              </a>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

