import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface NFTCardProps {
  nft: NFTItem;
  loading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NFTCard = ({ nft, loading }: NFTCardProps) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const isOwner = nft.seller.toLowerCase() === address?.toLowerCase();

  const { writeContract } = useScaffoldWriteContract({ contractName: "NFTMarketplace" });

  const { data: hash, isPending: isPurchasing } = useScaffoldWriteContract({ contractName: "NFTMarketplace" });

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: tokenURI } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "tokenURI",
    args: [nft.tokenId],
  });

  const [metadata, setMetadata] = useState<NFTMetadata | undefined>();

  const onPurchase = async (nft: NFTItem) => {
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

  const {
    writeContract: unlistNFT,
    data: unlistHash,
    isPending: isUnlisting,
  } = useScaffoldWriteContract({ contractName: "NFTMarketplace" });

  const { isLoading: isUnlistConfirming } = useWaitForTransactionReceipt({
    hash: unlistHash,
  });

  const handleUnlistNFT = async (tokenId: bigint) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      unlistNFT({
        functionName: "unListToken",
        args: [tokenId],
      });
    } catch (error) {
      console.error("Error unlisting NFT:", error);
      alert("Failed to unlist NFT. Please try again.");
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        try {
          const metadataResponse = await fetch(tokenURI);
          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            setMetadata(metadata);
          }
        } catch (error) {
          console.error(`Error loading metadata for token ${nft.tokenId}:`, error);
        }
      }
    };
    fetchMetadata();
  }, [tokenURI, nft.tokenId]);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-square bg-gray-700 flex items-center justify-center">
        {metadata?.image?.link ? (
          <img
            src={metadata.image.link}
            alt={metadata?.name || `NFT #${nft.tokenId}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center p-4">
            <p>No image available</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 truncate">{metadata?.name || `NFT #${nft.tokenId}`}</h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{metadata?.description || "No description available"}</p>

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
            onClick={() => {
              router.push(`/nftpage/${nft.tokenId}`);
              loading?.(true);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            View
          </button>

          {!isOwner && (
            <button
              onClick={() => onPurchase(nft)}
              disabled={isPurchasing || isConfirming}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                isPurchasing || isConfirming
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              }`}
            >
              {isPurchasing ? "Buying..." : isConfirming ? "Confirming..." : "Buy"}
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => handleUnlistNFT(nft.tokenId)}
              disabled={isUnlisting || isUnlistConfirming}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                isUnlisting || isUnlistConfirming
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer"
              }`}
            >
              {isUnlisting ? "Unlisting..." : isUnlistConfirming ? "Confirming..." : "Unlist NFT"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
