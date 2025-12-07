"use client";

import { useState } from "react";
import {
  useCurrentAccount,
  useIotaClient,
  useSignAndExecuteTransaction,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import {
  COUPON_PACKAGE_ID,
  COUPON_MODULE_NAME,
  COUPON_METHODS,
} from "@/lib/config";

/**
 * Hook to interact with the Time-Locked Coupon smart contract.
 *
 * Exposes:
 *  - account: current wallet account
 *  - isLoading: global loading flag
 *  - txHash: last transaction hash
 *  - error: last error (if any)
 *  - lastCouponId: last minted coupon object ID
 *  - mintCoupon(unlockTimeMs): mint a new coupon locked until unlockTimeMs
 *  - redeemCoupon(couponId): try to redeem a coupon using current time
 */
export function useCoupons() {
  const account = useCurrentAccount();
  const iotaClient = useIotaClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lastCouponId, setLastCouponId] = useState<string | null>(null);

  /**
   * Mint a new time-locked coupon for the connected wallet.
   * @param unlockTimeMs - timestamp in milliseconds (JavaScript Date.now())
   * @returns coupon object ID if successfully created, otherwise null
   */
  const mintCoupon = async (unlockTimeMs: number): Promise<string | null> => {
    if (!account) {
      setError(new Error("Wallet is not connected"));
      return null;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const tx = new Transaction();

      // Convert JS number (ms) to u64 (BigInt) for Move
      const unlockTimeU64 = BigInt(unlockTimeMs);

      // Call: time_locked_coupon::time_locked_coupon::mint_coupon(unlock_time: u64, ctx)
      tx.moveCall({
        target: `${COUPON_PACKAGE_ID}::${COUPON_MODULE_NAME}::${COUPON_METHODS.MINT}`,
        arguments: [tx.pure.u64(unlockTimeU64)],
      });

      const res = await signAndExecute({
        transaction: tx as never,
      });

      const digest = res?.digest;
      if (!digest) {
        throw new Error("Failed to get transaction digest");
      }

      setTxHash(digest);

      // Wait for the transaction to be confirmed and fetch effects
      const effectsResult = await iotaClient.waitForTransaction({
        digest,
        options: { showEffects: true },
      });

      const created = effectsResult.effects?.created ?? [];

      const createdIds: string[] = created
        .map((c: any) => c.reference?.objectId as string | undefined)
        .filter((id: string | undefined): id is string => !!id);

      let couponId: string | null = null;

      // Find the created object whose type includes ::Coupon
      for (const id of createdIds) {
        const obj = await iotaClient.getObject({
          id,
          options: { showType: true },
        });const type = obj.data?.type;
        if (typeof type === "string" && type.includes("::Coupon")) {
          couponId = id;
          break;
        }
      }

      if (couponId) {
        setLastCouponId(couponId);
      }

      setIsLoading(false);
      return couponId;
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      setIsLoading(false);
      return null;
    }
  };

  /**
   * Redeem an existing coupon if unlocked and not used.
   * @param couponId - ID of the coupon object on-chain
   */
  const redeemCoupon = async (couponId: string): Promise<boolean> => {
    if (!account) {
      setError(new Error("Wallet is not connected"));
      return false;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const tx = new Transaction();

      // Current time in ms as u64
      const nowMs = BigInt(Date.now());

      // Call: redeem_coupon(coupon: &mut Coupon, current_time: u64, ctx)
      tx.moveCall({
        target: `${COUPON_PACKAGE_ID}::${COUPON_MODULE_NAME}::${COUPON_METHODS.REDEEM}`,
        arguments: [tx.object(couponId), tx.pure.u64(nowMs)],
      });

      const res = await signAndExecute({
        transaction: tx as never,
      });

      const digest = res?.digest;
      if (!digest) {
        throw new Error("Failed to get transaction digest");
      }

      setTxHash(digest);

      // Optional: wait for confirmation
      await iotaClient.waitForTransaction({
        digest,
        options: { showEffects: true },
      });

      setIsLoading(false);
      return true;
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      setIsLoading(false);
      return false;
    }
  };

  return {
    account,
    isLoading,
    txHash,
    error,
    lastCouponId,
    mintCoupon,
    redeemCoupon,
  };
}