"use client";

import { useState } from "react";
import { Container, Heading, Text, Button, TextField } from "@radix-ui/themes";
import ClipLoader from "react-spinners/ClipLoader";
import { useCoupons } from "@/hooks/useCoupons";

export default function HomePage() {
  const {
    account,
    isLoading,
    txHash,
    error,
    lastCouponId,
    mintCoupon,
    redeemCoupon,
  } = useCoupons();

  const [minutes, setMinutes] = useState("1");
  const [couponIdInput, setCouponIdInput] = useState("");

  const handleMint = async () => {
    const mins = Number(minutes);
    if (Number.isNaN(mins) || mins <= 0) return;

    const unlockTime = Date.now() + mins * 60 * 1000;
    await mintCoupon(unlockTime);
  };

  const handleRedeem = async () => {
    if (!couponIdInput) return;
    await redeemCoupon(couponIdInput);
  };

  return (
    <Container style={{ maxWidth: 700, marginTop: 60, marginBottom: 60 }}>
      <Heading size="6" mb="5">
        🎟️ Time-Locked Coupons DApp
      </Heading>

      {account ? (
        <Text mb="4" size="2" style={{ fontFamily: "monospace" }}>
          Connected wallet: {account.address}
        </Text>
      ) : (
        <Text mb="4" color="red">
          Please connect your IOTA wallet using the wallet UI to continue.
        </Text>
      )}

      {/* Mint Coupon */}
      <div
        style={{
          padding: 20,
          borderRadius: 12,
          background: "var(--gray-a3)",
          marginBottom: 20,
        }}
      >
        <Heading size="4" mb="2">
          1️⃣ Mint Coupon
        </Heading>

        <Text mb="2">
          Set how many minutes from now the coupon becomes redeemable:
        </Text>

        <TextField.Root
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          style={{ maxWidth: 120, marginBottom: 12 }}
        />

        <div>
          <Button onClick={handleMint} disabled={isLoading || !account}>
            {isLoading ? (
              <>
                <ClipLoader size={16} style={{ marginRight: 8 }} />
                Minting...
              </>
            ) : (
              "Mint Coupon"
            )}
          </Button>
        </div>

        {lastCouponId && (
          <Text mt="3" size="2" style={{ display: "block", wordBreak: "break-all" }}>
            ✅ Last minted coupon ID: {lastCouponId}
          </Text>
        )}
      </div>

      {/* Redeem Coupon */}
      <div
        style={{
          padding: 20,
          borderRadius: 12,
          background: "var(--gray-a3)",
          marginBottom: 20,
        }}
      >
        <Heading size="4" mb="2">
          2️⃣ Redeem Coupon
        </Heading>

        <Text mb="2">
          Paste a coupon object ID to redeem it (after it is unlocked):
        </Text>

        <TextField.Root
          placeholder="Paste Coupon ID here"
          value={couponIdInput}
          onChange={(e) => setCouponIdInput(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <div>
          <Button onClick={handleRedeem} disabled={isLoading || !account}>
            {isLoading ? (
              <>
                <ClipLoader size={16} style={{ marginRight: 8 }} />
                Redeeming...
              </>
            ) : (
              "Redeem Coupon"
            )}
          </Button>
        </div>
      </div>

      {/* Transaction Info */}
      {txHash && (
        <div
          style={{
            padding: 16,
            background: "var(--blue-a3)",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text size="2" mb="1">
            ✅ Transaction confirmed
          </Text>
          <Text size="1" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>
            {txHash}
          </Text>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: 16,
            background: "var(--red-a3)",
            borderRadius: 8,
          }}
        >
          <Text color="red">{error.message}</Text>
        </div>
      )}
    </Container>
  );
}