# 🚀 Solana Swap - Setup Guide for Devnet

## ✅ Your Current Setup

Based on your terminal, you have successfully created:

**Token A (You Offer):**
- Mint Address: `6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD`
- Balance: 100 tokens
- Token Account: `EbEiRqro7CU66V6TkEnxvNHLyFa9fD8DyU9hEyQRLfM5`

**Token B (You Want):**
- Mint Address: `D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg`
- Balance: 200 tokens
- Token Account: `HccgTv2TaZUnMd9sKjErRETh6QXVbuJfC36wdbtD1bU3`

**SOL Balance:** 7.0970568 SOL ✅

🎉 **You're ready to create offers!** Scroll down to see how.

---

## Before Creating an Offer (For New Users)

You need to set up your tokens on Solana Devnet first.

### Step 1: Configure Solana CLI for Devnet

```bash
solana config set --url devnet
solana config get
```

### Step 2: Get Devnet SOL (for transaction fees)

```bash
solana airdrop 2
solana balance
```

### Step 3: Create Test Tokens

You need to create 2 SPL tokens for testing:

```bash
# Create Token A (the token you'll offer)
spl-token create-token --decimals 6
# Output: Creating token ABC123...
# SAVE THIS ADDRESS as Token A Mint!

# Create Token B (the token you want)
spl-token create-token --decimals 6
# Output: Creating token XYZ789...
# SAVE THIS ADDRESS as Token B Mint!
```

### Step 4: Create Token Accounts

You need to create accounts to hold these tokens:

```bash
# Create account for Token A
spl-token create-account <TOKEN_A_MINT_ADDRESS>

# Create account for Token B  
spl-token create-account <TOKEN_B_MINT_ADDRESS>
```

### Step 5: Mint Tokens to Your Wallet

```bash
# Mint 10 of Token A to yourself
spl-token mint <TOKEN_A_MINT_ADDRESS> 10

# Mint 20 of Token B to yourself
spl-token mint <TOKEN_B_MINT_ADDRESS> 20
```

### Step 6: Verify Your Balances

```bash
# Check all your token balances
spl-token accounts
```

You should see:
```
Token                                         Balance
------------------------------------------------------------
<TOKEN_A_MINT>                                10
<TOKEN_B_MINT>                                20
```

---

## 🚀 Now You Can Create an Offer!

### Using Your Tokens:

1. Go to http://localhost:3000
2. Connect your Solana wallet (must be the same wallet you used in CLI)
3. Click "Create Offer"
4. Fill in the form with YOUR tokens:

```
Offer ID: 1
Token A Mint (You Offer): 6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD
Amount to Offer: 1.0
Token B Mint (You Want): D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg
Amount You Want: 2.0
```

5. Click "Create Offer"
6. Approve the transaction in your wallet

**This will create an offer to swap 1 Token A for 2 Token B!**

### Example Offers You Can Create:

**Offer 1:** Trade 5 Token A for 10 Token B
```
Offer ID: 1
Token A: 6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD
Amount: 5.0
Token B: D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg
Amount: 10.0
```

**Offer 2:** Trade 10 Token A for 20 Token B
```
Offer ID: 2
Token A: 6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD
Amount: 10.0
Token B: D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg
Amount: 20.0
```

---

## 🔄 Testing the Complete Flow

### As Maker (Your Current Wallet):
✅ You've already done this:
1. ✅ Created Token A: `6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD`
2. ✅ Created Token B: `D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg`
3. ✅ Minted 100 Token A and 200 Token B
4. **Next:** Create an offer using the UI!

### As Taker (Different Wallet - for testing):
To test taking your offer with a different wallet:

```bash
# 1. Export your second wallet (or create new one)
solana-keygen new --outfile ~/.config/solana/wallet2.json

# 2. Switch to new wallet
solana config set --keypair ~/.config/solana/wallet2.json

# 3. Get SOL
solana airdrop 2

# 4. Create account for Token B (needed to receive it)
spl-token create-account D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg

# 5. Mint Token B to this wallet (so they can swap)
solana config set --keypair ~/.config/solana/id.json  # Switch back to mint authority
spl-token mint D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg 50 HccgTv2TaZUnMd9sKjErRETh6QXVbuJfC36wdbtD1bU3

# 6. Switch back to wallet 2
solana config set --keypair ~/.config/solana/wallet2.json

# 7. Connect this wallet in the browser and take the offer!
```

---

## Common Issues

### ❌ "AccountNotInitialized" Error
**Problem**: Token account doesn't exist

**Solution**: 
```bash
spl-token create-account <TOKEN_MINT_ADDRESS>
```

### ❌ "Insufficient Funds" Error
**Problem**: Not enough tokens in your account

**Solution**:
```bash
spl-token mint <TOKEN_MINT_ADDRESS> 10
```

### ❌ Transaction fails immediately
**Problem**: Not enough SOL for transaction fees

**Solution**:
```bash
solana airdrop 2
```

---

## Quick Command Reference

```bash
# Check your Solana address
solana address

# Check SOL balance
solana balance

# Check token balances
spl-token accounts

# Check specific token balance
spl-token balance <TOKEN_MINT_ADDRESS>

# View transaction on explorer
# https://explorer.solana.com/tx/<TX_SIGNATURE>?cluster=devnet
```

---

## Example Complete Flow

```bash
# 1. Setup
solana config set --url devnet
solana airdrop 2

# 2. Create tokens
TOKEN_A=$(spl-token create-token --decimals 6 | grep "Creating token" | awk '{print $3}')
TOKEN_B=$(spl-token create-token --decimals 6 | grep "Creating token" | awk '{print $3}')

echo "Token A: $TOKEN_A"
echo "Token B: $TOKEN_B"

# 3. Create accounts
spl-token create-account $TOKEN_A
spl-token create-account $TOKEN_B

# 4. Mint tokens
spl-token mint $TOKEN_A 10
spl-token mint $TOKEN_B 20

# 5. Check balances
spl-token accounts

# 6. Now use the UI with these addresses!
```

Save the token mint addresses and use them in the UI! 🎉

---

## 📋 Your Token Summary Card

Copy this for easy reference:

```
═══════════════════════════════════════════════════════
              YOUR SOLANA SWAP TOKENS
═══════════════════════════════════════════════════════

Network: Devnet
SOL Balance: 7.0970568 SOL

TOKEN A (Offer This):
  Mint: 6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD
  Balance: 100 tokens
  Account: EbEiRqro7CU66V6TkEnxvNHLyFa9fD8DyU9hEyQRLfM5

TOKEN B (Want This):
  Mint: D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg
  Balance: 200 tokens
  Account: HccgTv2TaZUnMd9sKjErRETh6QXVbuJfC36wdbtD1bU3

Explorer:
  Token A: https://explorer.solana.com/address/6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD?cluster=devnet
  Token B: https://explorer.solana.com/address/D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg?cluster=devnet

═══════════════════════════════════════════════════════
```

## 🎯 Quick Commands for Your Tokens

```bash
# Check Token A balance
spl-token balance 6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD

# Check Token B balance
spl-token balance D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg

# Mint more Token A (if needed)
spl-token mint 6wzoy4BUNHA9Pwd7e25sje2J1sPaKzrqz4toBKnSjuHD 10

# Mint more Token B (if needed)
spl-token mint D9QZRMhQEmnWWQc9V26tepWxBWR9yDePGQViTr8ZrRHg 20

# View all your accounts
spl-token accounts
```

