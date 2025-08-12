"use client";

import React, { useEffect, useState } from "react";
import NFTCard from "./components/NFTCard";
import type { NextPage } from "next";
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

const Discover: NextPage = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();

  const {
    data: allNFTs,
    isLoading: isLoadingNFTs,
    refetch: refetchNFTs,
  } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "getAllNFTs",
  });

  const {
    writeContract,
    data: hash,
    isPending: isPurchasing,
    error: purchaseError,
  } = useScaffoldWriteContract({ contractName: "NFTMarketplace" });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!allNFTs || allNFTs.length === 0) {
      setNfts([]);
      setLoading(false);
    } else {
      setNfts([...allNFTs]);
      setLoading(isLoadingNFTs);
    }
  }, [allNFTs, isLoadingNFTs]);

  useEffect(() => {
    if (isSuccess) {
      refetchNFTs();
      alert(`NFT purchased successfully! Transaction hash: ${hash}`);
    }
  }, [isSuccess, hash, refetchNFTs]);

  const handlePurchase = async (nft: NFTItem) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (nft.seller.toLowerCase() === address?.toLowerCase()) {
      alert("You cannot buy your own NFT");
      return;
    }

    try {
      writeContract({
        functionName: "executeSale",
        args: [nft.tokenId],
        value: nft.price,
      });
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Failed to purchase NFT. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Discover NFTs</h1>
          <p className="text-gray-300 text-lg">Explore and purchase unique digital collectibles</p>
        </div>

        {purchaseError && (
          <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4 mb-6">
            <p className="text-red-300">Error: {purchaseError.message}</p>
          </div>
        )}

        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl p-6">
          {loading || isLoadingNFTs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading NFTs...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-xl mb-2">No NFTs available</p>
              <p className="text-gray-400">Be the first to mint and list an NFT!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Available NFTs ({nfts.length})</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map(nft => (
                  <NFTCard
                    key={nft.tokenId.toString()}
                    nft={nft}
                    onPurchase={handlePurchase}
                    isPurchasing={isPurchasing}
                    isConfirming={isConfirming}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
