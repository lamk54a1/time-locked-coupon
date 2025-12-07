"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IotaClientProvider, WalletProvider } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";

const queryClient = new QueryClient();

// Define networks for IotaClientProvider
const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
};

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider autoConnect>{children}</WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;