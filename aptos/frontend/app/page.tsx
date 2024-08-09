'use client'
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Image from "next/image";
import Chat from "../components/Chat";
import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { NightlyWallet } from '@nightlylabs/aptos-wallet-adapter-plugin'

export default function Home() {
  const wallets = [new NightlyWallet()];

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <main className="flex min-h-screen flex-col items-center justify-between p-12">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-lg lg:flex">

          <WalletSelector />
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/movement.svg"
                alt="Movement Logo"
                className="light:invert"
                width={200}
                height={48}
                priority
              />
            </a>
          </div>
        </div>
        <Chat />

        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-yellow-400 before:dark:opacity-10 after:dark:from-yellow-700 after:dark:via-[#ead622] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">

        </div>

      </main>
    </AptosWalletAdapterProvider>
  );
}
