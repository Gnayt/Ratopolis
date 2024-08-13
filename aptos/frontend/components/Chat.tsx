"use client";
import { useEffect, useState } from "react";
import { createSurfClient, createEntryPayload } from "@thalalabs/surf";
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useSubmitTransaction } from "@thalalabs/surf/hooks";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NextResponse } from "next/server";
import { hex2a, formatDate, formatAddress } from "@/util/functions";

interface Message {
    sender: string;
    text: string,
    timestamp: number;
    ref_id: string;
    metadata: string;
}

// instantiate the client
const client = createSurfClient(new Aptos(new AptosConfig({ fullnode: "https://aptos.devnet.m1.movementlabs.xyz" })));

const abi = { "address": "0x8c9e3104a866a70ebee3d3aab02ff66d5d7a70993f0f04899f5424d47bf1d10a", "name": "Chat", "friends": [], "exposed_functions": [
    {
        "name": "mint",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": ["&signer","address","string"],
        "return": []
    },
    {
        "name": "add_component",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": ["&signer", "u64", "address", "bool", "string"],
        "return": []
      },
      {
        "name": "remove_component",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": ["&signer", "u64", "u64"],
        "return": []
      },
      {
        "name": "modify_component",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": ["&signer", "u64", "u64", "address", "bool"],
        "return": []
      }
], 
    "structs": [
        {
            "name": "Component",
            "is_native": false,
            "abilities": ["store", "key"],
            "generic_type_params": [],
            "fields": [
              { "name": "id", "type": "u64" },
              { "name": "owner", "type": "address" },
              { "name": "transferable", "type": "bool" },
              { "name": "image_url", "type": "string" }
            ]
          },
          {
            "name": "Body",
            "is_native": false,
            "abilities": ["store", "key"],
            "generic_type_params": [],
            "fields": [
              { "name": "id", "type": "u64" },
              { "name": "owner", "type": "address" },
              { "name": "components", "type": "vector<Component>" }
            ]
          }
    ] } as const;
export default function Chat() {
    const [history, setHistory] = useState([] as Message[]);
    const [message, setMessage] = useState("hello");
    const { account } = useWallet();

    const {
        isIdle,
        reset,
        isLoading: submitIsLoading,
        error: submitError,
        submitTransaction,
        data: submitResult,
    } = useSubmitTransaction();

    const postMessage = async () => {
        try {
            const payload = createEntryPayload(abi, {
                function: 'mint',
                typeArguments: [],
                functionArguments: [[], abi.address,''],

            });
            const tx = await submitTransaction(payload);
            return NextResponse.json({ tx });
        } catch (e) {
            console.error('error', e);
        }
    };


    return (
        <div className="grid grid-flow-col-1 group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 dark:border-neutral-700 dark:bg-neutral-800/30">
            <h1 className="text-lg">History</h1>
            <div id="scrollableContainer" className="overflow-y-scroll h-72">


                {history.map((message, index) => (

                    <div key={index} className={message.sender == account?.address ? "text-right border-b-[1px] border-stone-700 p-2" : "border-b-[1px] border-stone-700 p-2"}>
                        <p className={message.sender == account?.address ? "text-stone-400" : ""}>{message.sender == account?.address ? "You: " : formatAddress(message.sender as string) + ": "}{hex2a(message.text.slice(2))}</p>

                        <p className="text-xs">{formatDate(new Date(message.timestamp * 1000))}</p>
                    </div>
                ))}
            </div>
            <form className="" onSubmit={(e) => { e.preventDefault(); postMessage(); }}>
                <label className="p-2">Message
                    <input type="text" className="z-2000 text-white bg-black p-2 m-2 border-[1px]ot " defaultValue={"hello"} onChange={updateMessage} />
                </label>
            </form>
            <button className="bg-black border-gray-300 rounded-lg border-[1px] text-white" onClick={postMessage}>Send</button>
        </div>
    )
}