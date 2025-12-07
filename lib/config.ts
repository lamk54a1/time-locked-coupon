// lib/config.ts

// Network we are using – same as other projects
export const NETWORK = "devnet";

// TODO: Replace this with the real PackageID after you publish the contract
// Example: "0xfabc1234..."
export const COUPON_PACKAGE_ID =
  "0x8659089ee35fa406d8345a34845d0ac6535df566592fd4bc15ea384dd6329f19"

export const COUPON_MODULE_NAME = "time_locked_coupon";

export const COUPON_METHODS = {
  MINT: "mint_coupon",
  REDEEM: "redeem_coupon",
} as const;