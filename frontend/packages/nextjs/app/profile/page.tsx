"use client";

import React, { useEffect, useState } from "react";
import NFTCard from "../discover/components/NFTCard";
import { blo } from "blo";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface NFTMetadata {
  name: string;
  description: string;
  image: {
    link: string;
  };
}

interface NFTItem {
  tokenId: bigint;
  seller: string;
  price: bigint;
  currentlyListed: boolean;
  metadata?: NFTMetadata;
  tokenURI?: string;
}

const Profile: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"nft" | "photos">("nft");
  const [depositAmount, setDepositAmount] = useState("0.001");
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const { address, isConnected } = useAccount();

  const { data: contractBalance } = useScaffoldReadContract({
    contractName: "BalanceManager",
    functionName: "getBalance",
    args: [address],
  });

  const { data: myNFTs, isLoading: isLoadingNFTs } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "getMyNFTs",
  });

  const {
    writeContract,
    data: depositHash,
    isPending: isDepositing,
    error: depositError,
  } = useScaffoldWriteContract({ contractName: "BalanceManager" });

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  useEffect(() => {
    if (!myNFTs || myNFTs.length === 0) {
      setNfts([]);
      setLoading(false);
    } else {
      setNfts([...myNFTs]);
      setLoading(isLoadingNFTs);
    }
  }, [myNFTs, isLoadingNFTs]);

  useEffect(() => {
    const loadUserPhotos = async () => {
      if (!address) return;

      setLoadingPhotos(true);
      try {
        const resPhotos = await fetch("/api/photos-get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        });

        const photoIds = await resPhotos.json();

        if (!resPhotos.ok) {
          console.error("Failed to fetch photo IDs:", photoIds.error || "Unknown error");
          setLoadingPhotos(false);
          return;
        }

        setUserPhotos(photoIds || []);
      } catch (error) {
        console.error("Error loading user photos:", error);
      } finally {
        setLoadingPhotos(false);
      }
    };

    loadUserPhotos();
  }, [address]);

  useEffect(() => {
    if (isDepositSuccess) {
      setDepositAmount("0.1");
      alert(`Deposit successful! Transaction hash: ${depositHash}`);
    }
  }, [isDepositSuccess, depositHash]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount");
      return;
    }

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      writeContract({
        functionName: "deposit",
        value: parseEther(depositAmount),
      });
    } catch (error) {
      console.error("Error depositing:", error);
      alert("Failed to deposit. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
              <div className="flex-shrink-0">
                {address && address.startsWith("0x") && <img alt="blo" src={blo(address as `0x${string}`)} />}
              </div>
              <div className="text-gray-300 mb-4">
                <p className="font-mono text-sm">
                  <strong>Wallet:</strong> {address || "Not connected"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">ETH Balance</p>
                  <p className="text-white font-bold text-lg">
                    {contractBalance ? formatEther(contractBalance) : "0"} ETH
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-3">Deposit to Contract</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    placeholder="Amount in ETH"
                    className="flex-1 p-2 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isDepositing || isDepositConfirming}
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={isDepositing || isDepositConfirming || !depositAmount || parseFloat(depositAmount) <= 0}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                      isDepositing || isDepositConfirming || !depositAmount || parseFloat(depositAmount) <= 0
                        ? "bg-gray-600 cursor-not-allowed text-gray-400"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isDepositing ? "Depositing..." : isDepositConfirming ? "Confirming..." : "Deposit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {depositError && (
          <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4 mb-6">
            <p className="text-red-300">Error: {depositError?.message}</p>
          </div>
        )}

        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("nft")}
              className={`px-6 py-3 font-semibold flex items-center gap-2 ${
                activeTab === "nft" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-white"
              }`}
            >
              My Linsted NFTs ({myNFTs && myNFTs!.length})
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-6 py-3 font-semibold flex items-center gap-2 ${
                activeTab === "photos"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              My Photos ({userPhotos.length})
            </button>
          </div>

          {activeTab === "nft" && (
            <div>
              {loading || isLoadingNFTs ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white">Loading NFTs...</p>
                </div>
              ) : nfts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white text-xl mb-2">No NFTs available</p>
                  <p className="text-gray-400">Start by minting your first NFT!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Available NFTs ({nfts.length})</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nfts.map(nft => (
                      <NFTCard key={nft.tokenId.toString()} nft={nft} loading={setLoading} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div>
              {loadingPhotos ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white">Loading your photos...</p>
                </div>
              ) : userPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white text-xl mb-2">No photos found</p>
                  <p className="text-gray-400">Your created photos will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-square">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
