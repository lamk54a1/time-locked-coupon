import type { Metadata } from "next";
import "./globals.css";

import AppProviders from "./providers";
import { Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import "@iota/dapp-kit/dist/index.css";

export const metadata: Metadata = {
  title: "Time-Locked Coupons DApp",
  description: "On-chain time-locked coupon system on IOTA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theme appearance="dark" accentColor="indigo">
          <AppProviders>{children}</AppProviders>
        </Theme>
      </body>
    </html>
  );
}