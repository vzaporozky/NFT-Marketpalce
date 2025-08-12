"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatEther } from "viem";
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

const NFTPage = () => {
  const router = useRouter();
  const { tokenId } = useParams();
  const { address, isConnected } = useAccount();
  const [nft, setNft] = useState<NFTItem | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: listedToken } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "getListedTokenForId",
    args: [BigInt(tokenId as string)],
  });

  const { data: tokenURI } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "tokenURI",
    args: [BigInt(tokenId as string)],
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (listedToken && tokenURI) {
        try {
          const metadataResponse = await fetch(tokenURI);
          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            setNft({
              ...listedToken,
              tokenURI,
              metadata,
            });
          } else {
            setNft({ ...listedToken, tokenURI });
          }
        } catch (error) {
          console.error(`Error loading metadata for token ${tokenId}:`, error);
          setNft({ ...listedToken, tokenURI });
        }
      }
      setLoading(false);
    };
    fetchMetadata();
  }, [listedToken, tokenURI, tokenId]);

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
    if (isSuccess) {
      alert(`NFT purchased successfully! Transaction hash: ${hash}`);
      router.push("/discover");
    }
  }, [isSuccess, hash, router]);

  const handlePurchase = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    if (!nft) return;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading NFT...</p>
        </div>
      </div>
    );
  }

  if (!nft || !nft.currentlyListed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-white text-xl mb-2">NFT not found or not listed</p>
          <button
            onClick={() => router.push("/discover")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const isOwner = nft.seller.toLowerCase() === address?.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto bg-black bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl p-6">
        <button
          onClick={() => router.push("/discover")}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold"
        >
          Back to Discover
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
            {nft.metadata?.image?.link ? (
              <img
                src={nft.metadata.image.link}
                alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <p>No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{nft.metadata?.name || `NFT #${nft.tokenId}`}</h2>
              <p className="text-gray-300">{nft.metadata?.description || "No description available"}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Buy NFT</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-bold">{formatEther(nft.price)} ETH</span>
                </div>
                {purchaseError && <p className="text-red-300 text-sm">Error: {purchaseError.message}</p>}
                {!isOwner && isConnected && (
                  <button
                    onClick={handlePurchase}
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
                        : `Buy for ${formatEther(nft.price)} ETH`}
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
    </div>
  );
};

export default NFTPage;
