"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CreatePhoto: NextPage = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { address: userAddress, isConnected } = useAccount();

  const {
    data: creationPrice,
    isLoading: priceLoading,
    error: priceError,
  } = useScaffoldReadContract({
    contractName: "BalanceManager",
    functionName: "getPrice",
  });
  const {
    data: userBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useScaffoldReadContract({
    contractName: "BalanceManager",
    functionName: "getBalance",
    args: [userAddress || "0x0000000000000000000000000000000000000000"],
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({ contractName: "BalanceManager" });

  const isCreateDisabled = useMemo(() => {
    if (!prompt || !creationPrice || !userBalance) return true;
    return Number(userBalance) < Number(creationPrice);
  }, [prompt, creationPrice, userBalance]);

  const handleCreate = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }
    if (!creationPrice || !userBalance) {
      setError("Cannot fetch balance or price");
      return;
    }
    if (Number(userBalance) < Number(creationPrice)) {
      setError("Insufficient balance");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTitle("");
      setPrompt("");
      setPhotoUrl(null);

      const tx = await writeYourContractAsync({
        functionName: "createPhoto",
      });

      console.log("Transaction sent:", tx);

      const data = {
        title: title,
        description: prompt,
        userAddress: userAddress || "testda",
        transactionHash: tx,
      };

      const res = await fetch("/api/photo-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create photo");

      const result = await res.json();
      setPhotoUrl(result.photoUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-black bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 flex flex-col md:flex-row gap-6">
        {error && <p className="text-red-500">{error}</p>}
        {priceError && <p className="text-red-500">Price Error: {priceError.message}</p>}
        {balanceError && <p className="text-red-500">Balance Error: {balanceError.message}</p>}

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-4">Generated Image</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-[400px]">
              <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                {loading ? (
                  <p className="text-gray-400 animate-pulse">Loading...</p>
                ) : photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Generated"
                    width={400}
                    height={400}
                    className="max-w-full max-h-full rounded-lg"
                    unoptimized
                  />
                ) : (
                  <p className="text-gray-400">No image generated yet</p>
                )}
              </div>
            </div>
            <div className="w-full md:w-80 flex flex-col gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white">Pricing Info</h3>
                <p className="text-white">
                  Creation Price:{" "}
                  {priceLoading
                    ? "Loading..."
                    : creationPrice
                      ? `${Number(formatEther(creationPrice)).toFixed(4)} ETH`
                      : "Unavailable"}
                </p>
                <p className="text-white">
                  Your Balance:{" "}
                  {!isConnected
                    ? "Connect wallet to see balance"
                    : balanceLoading
                      ? "Loading..."
                      : userBalance
                        ? `${Number(formatEther(userBalance)).toFixed(4)} ETH`
                        : "0 ETH"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-white font-medium">
                  Title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter your title..."
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="prompt" className="text-white font-medium">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Enter your image prompt..."
                  className="w-full h-32 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleCreate}
                  disabled={isCreateDisabled || loading}
                  className={`w-full py-2 rounded-lg font-semibold text-white  ${
                    !isCreateDisabled && !loading
                      ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Processing..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePhoto;
