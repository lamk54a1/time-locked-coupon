# SCREENSHOTS
<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/8b03934d-2fe9-4506-add7-debd39486219" />
# Explorer Link & Contract Address

**Network:** devnet

**Package ID:** 0x8659089ee35fa406d8345a34845d0ac6535df566592fd4bc15ea384dd6329f19

**Explorer:** https://explorer.iota.org/object/0x8659089ee35fa406d8345a34845d0ac6535df566592fd4bc15ea384dd6329f19?network=devnet

# 🎟️ Time-Locked Coupons DApp  
**On-Chain Time-Based Coupon System on IOTA (Move + Next.js)**

Time-Locked Coupons is a decentralized application (dApp) built on the **IOTA blockchain**, allowing users to mint and redeem coupons that are **locked until a predefined unlock time**.  
Each coupon is a fully **on-chain object**, secured by a **Move smart contract**, and can only be redeemed **after the unlock time** and **only once**.

This project demonstrates:
- Time-based smart contract logic with **Move**
- Secure on-chain object mutation
- Wallet & transaction integration on **IOTA**
- A modern **Next.js Web3 frontend**

---

## 🔗 Live Network & Contract

- **Network:** IOTA Devnet  
- **Smart Contract (Package ID – Devnet):**
```
0xPASTE_YOUR_TIME_LOCKED_COUPON_PACKAGE_ID_HERE
```

- **Main On-Chain Module:**
```
time_locked_coupon::time_locked_coupon
```

> ⚠️ Note: Testnet/Mainnet deployment can be added later.

---

## 🚀 Core Features

- 🔐 Wallet connection using **IOTA Wallet**
- 🎫 Mint **time-locked coupons** on-chain
- ⏳ Coupon can only be redeemed **after unlock time**
- ✅ On-chain validation (time + ownership)
- 🔁 Each coupon can be redeemed **only once**
- 🔗 Full transaction hash & on-chain confirmation
- ❌ Proper error handling for:
  - Redeem too early
  - Redeem already used coupon
  - Redeem by non-owner

---

## 🛠 Technology Stack

### Blockchain & Smart Contracts
- **Blockchain:** IOTA Devnet
- **Language:** Move (IOTA)
- **Object Model:** UID-based on-chain objects
- **Time Logic:** Block timestamp passed from frontend
- **Transaction Execution:** IOTA Transaction API

### Frontend
- **Framework:** Next.js (App Router, TypeScript)
- **Wallet & SDK:**  
  - `@iota/dapp-kit`  
  - `@iota/iota-sdk`
- **UI Library:** Radix UI
- **State & Data:** React Hooks, React Query
- **UX Loader:** react-spinners

---

## 📁 Project Structure

```txt
time-locked-coupon-dapp/
  app/
    layout.tsx        # Root layout
    page.tsx          # Main UI
    providers.tsx     # IOTA + Wallet + React Query providers
    globals.css
  hooks/
    useCoupons.ts     # Blockchain interaction logic
  lib/
    config.ts         # Network & contract configuration
  package.json

time_locked_coupon/   # Move smart contract
  Move.toml
  sources/
    time_locked_coupon.move
```

---

## ⚙️ Smart Contract Overview (Move)

### Main On-Chain Object

```move
public struct Coupon has key, store {
    id: UID,
    owner: address,
    unlock_time: u64,
    used: bool
}
```

### Main Entry Functions

```move
public entry fun mint_coupon(unlock_time: u64, ctx: &mut TxContext)
public entry fun redeem_coupon(coupon: &mut Coupon, current_time: u64, ctx: &mut TxContext)
```

### On-Chain Logic

#### ✅ Mint Coupon
1. Create a new `Coupon` object
2. Set:
   - `owner = sender`
   - `unlock_time = input`
   - `used = false`
3. Transfer coupon to user

#### ✅ Redeem Coupon
1. Verify caller is the owner
2. Verify `current_time >= unlock_time`
3. Verify `used == false`
4. Mark `used = true` (mutate on-chain object)

---

## 🧭 Application Flow

```text
User → Web UI → Wallet Signature → IOTA Blockchain
     ← Transaction Digest ← Confirmed Effects ← UI Update
```

Detailed Flow:

1. User connects wallet
2. User selects unlock time (in minutes)
3. User mints coupon on-chain
4. Wallet signs transaction
5. IOTA executes Move contract
6. Coupon object is created
7. After unlock time, user redeems coupon
8. Smart contract validates and marks coupon as used

---

## 🏗 Local Development Setup

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Configure Contract Address

Edit file:

```ts
// lib/config.ts
export const COUPON_PACKAGE_ID = "0xPASTE_YOUR_PACKAGE_ID_HERE";
```

---

### 3️⃣ Run the dApp

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## ⚙️ Smart Contract Build & Deployment

From the contract directory:

```bash
iota move build
```

Publish to Devnet:

```bash
iota client publish --gas-budget 200000000 .
```

Copy the returned `PackageID` and update it in:

```ts
lib/config.ts
```

---

## 🎮 How to Use

1. Open the dApp
2. Connect your IOTA wallet
3. Enter unlock time (in minutes)
4. Click **Mint Coupon**
5. Copy the generated **Coupon ID**
6. Wait until unlock time passes
7. Paste Coupon ID into **Redeem**
8. Click **Redeem Coupon**
9. Transaction is validated on-chain

---

## 🔐 Security & Validation

- All validation is executed **entirely on-chain**
- Ownership enforced by smart contract
- Time-lock enforced by on-chain assertions
- Coupon can never be redeemed twice
- No off-chain trust required
- Wallet signature required for all actions

---

## 📌 Known Limitations (Current Version)

- User must manually paste coupon ID
- No UI countdown timer yet
- No admin minting interface
- Unlock time passed from frontend (not oracle-based)
- No coupon expiration yet

---

## 🧩 Future Improvements

- ⏱ Real on-chain clock integration
- 🎯 Admin-issued coupons
- 👥 User dashboard (list owned coupons)
- 🧮 Automatic unlock countdown
- 🔁 Coupon expiration support
- 🏆 Coupon usage analytics

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Author

Developed as part of a Web3 learning & portfolio series using:

- IOTA Move Smart Contracts
- Secure On-Chain Object Design
- Modern Next.js dApp Architecture
- Wallet-Based Web3 Interaction
