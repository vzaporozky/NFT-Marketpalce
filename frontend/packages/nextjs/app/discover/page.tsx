"use client";

import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;

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
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    const loadNFTsWithMetadata = async () => {
      if (!allNFTs || allNFTs.length === 0) {
        setLoading(false);
        return;
      }

      console.log(allNFTs);

      setLoading(true);
      const nftsWithMetadata: NFTItem[] = [];

      for (const nft of allNFTs) {
        try {
          const tokenURIResponse = await fetch(
            `/api/get-token-uri?tokenId=${nft.tokenId}&contractAddress=${CONTRACT_ADDRESS}`,
          );
          let tokenURI = "";
          let metadata: NFTMetadata | undefined;

          if (tokenURIResponse.ok) {
            const tokenURIData = await tokenURIResponse.json();
            tokenURI = tokenURIData.tokenURI;

            if (tokenURI) {
              try {
                const metadataResponse = await fetch(tokenURI);
                if (metadataResponse.ok) {
                  metadata = await metadataResponse.json();
                }
              } catch (error) {
                console.error(`Error loading metadata for token ${nft.tokenId}:`, error);
              }
            }
          }

          nftsWithMetadata.push({
            ...nft,
            tokenURI,
            metadata,
          });
        } catch (error) {
          console.error(`Error processing NFT ${nft.tokenId}:`, error);
          nftsWithMetadata.push(nft);
        }
      }

      setNfts(nftsWithMetadata);
      setLoading(false);
    };

    loadNFTsWithMetadata();
  }, [allNFTs]);

  useEffect(() => {
    if (isSuccess) {
      refetchNFTs();
      setShowModal(false);
      setSelectedNFT(null);
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

  const openNFTModal = (nft: NFTItem) => {
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const NFTCard = ({ nft }: { nft: NFTItem }) => {
    const isOwner = nft.seller.toLowerCase() === address?.toLowerCase();

    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="aspect-square bg-gray-700 flex items-center justify-center">
          {nft.metadata?.image?.link ? (
            <img
              src={nft.metadata.image.link}
              alt={nft.metadata.name || `NFT #${nft.tokenId}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <p>No image available</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 truncate">
            {nft.metadata?.name || `NFT #${nft.tokenId}`}
          </h3>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {nft.metadata?.description || "No description available"}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400 text-xs">Price</p>
              <p className="text-white font-bold">{formatEther(nft.price)} ETH</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Token ID</p>
              <p className="text-white font-bold">#{nft.tokenId.toString()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => openNFTModal(nft)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              View
            </button>

            {!isOwner && (
              <button
                onClick={() => handlePurchase(nft)}
                disabled={isPurchasing || isConfirming}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  isPurchasing || isConfirming
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isPurchasing ? "Buying..." : isConfirming ? "Confirming..." : "Buy"}
              </button>
            )}

            {isOwner && (
              <div className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold text-center">
                Your NFT
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Модальное окно с деталями NFT
  const NFTModal = () => {
    if (!showModal || !selectedNFT) return null;

    const isOwner = selectedNFT.seller.toLowerCase() === address?.toLowerCase();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {selectedNFT.metadata?.name || `NFT #${selectedNFT.tokenId}`}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                {selectedNFT.metadata?.image?.link ? (
                  <img
                    src={selectedNFT.metadata.image.link}
                    alt={selectedNFT.metadata.name || `NFT #${selectedNFT.tokenId}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>No image available</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <p className="text-gray-300">{selectedNFT.metadata?.description || "No description available"}</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token ID:</span>
                      <span className="text-white">#{selectedNFT.tokenId.toString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white font-bold">{formatEther(selectedNFT.price)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seller:</span>
                      <span className="text-white font-mono text-xs">
                        {selectedNFT.seller.slice(0, 6)}...{selectedNFT.seller.slice(-4)}
                      </span>
                    </div>
                    {selectedNFT.tokenURI && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Metadata:</span>
                        <a
                          href={selectedNFT.tokenURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          View
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {!isOwner && isConnected && (
                  <button
                    onClick={() => handlePurchase(selectedNFT)}
                    disabled={isPurchasing || isConfirming}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                      isPurchasing || isConfirming
                        ? "bg-gray-600 cursor-not-allowed text-gray-400"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isPurchasing
                      ? "Purchasing..."
                      : isConfirming
                        ? "Confirming..."
                        : `Buy for ${formatEther(selectedNFT.price)} ETH`}
                  </button>
                )}

                {isOwner && (
                  <div className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold text-center">
                    You own this NFT
                  </div>
                )}

                {!isConnected && (
                  <div className="text-center text-gray-400">Connect your wallet to purchase this NFT</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                  <NFTCard key={nft.tokenId.toString()} nft={nft} />
                ))}
              </div>
            </>
          )}
        </div>

        <NFTModal />
      </div>
    </div>
  );
};

export default Discover;
