"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const MintNFT: NextPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftPrice, setNftPrice] = useState("0.1");
  const [createdImages, setCreatedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);

  const { isConnected } = useAccount();

  const { data: listPrice } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "getListPrice",
  });

  const {
    writeContractAsync: writeYourContractAsync,
    data: hash,
    isPending: isMinting,
    error: mintError,
  } = useScaffoldWriteContract({ contractName: "NFTMarketplace" });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setIpfsHash("https://bafybeift3lsrs4b4mlkemvab6rodzergpaej6jegr5dhllx2ozwlm4nexi.ipfs.community.bgipfs.com/");

    const fetchCreatedImages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/created-images");
        if (!response.ok) {
          throw new Error("Failed to fetch created images");
        }
        const data = await response.json();
        setCreatedImages(data.images || []);
      } catch (error) {
        console.error("Error fetching created images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedImages();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setImageFile(null);
      setImagePreview(null);
      setIpfsHash(null);
      setNftName("");
      setNftDescription("");
      setNftPrice("0.1");

      notification.success(`NFT minted successfully! Transaction hash: ${hash}`);
    }
  }, [isSuccess, hash]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadToIPFS = async () => {
    if (!imageFile || !nftName || !nftDescription) return;

    setUploadingToIPFS(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const imageResponse = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to upload image to IPFS");
      }

      const imageData = await imageResponse.json();

      const metadata = {
        name: nftName,
        description: nftDescription,
        image: imageData,
      };

      const metadataResponse = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (!metadataResponse.ok) {
        throw new Error("Failed to upload metadata to IPFS");
      }

      const metadataData = await metadataResponse.json();
      const tokenURI = `https://ipfs.io/ipfs/${metadataData}`;

      setIpfsHash(tokenURI);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      notification.error(`Failed to upload to IPFS. Please try again`);
    } finally {
      setUploadingToIPFS(false);
    }
  };

  const handleMint = async () => {
    if (!ipfsHash || !nftName || !nftDescription || !nftPrice) {
      notification.warning(`Please fill in all fields and upload to IPFS first`);
      return;
    }

    if (!isConnected) {
      notification.warning(`Please connect your wallet first`);
      return;
    }

    if (!listPrice) {
      notification.warning(`Unable to get listing price from contract`);
      return;
    }

    try {
      console.log(parseEther(nftPrice));

      await writeYourContractAsync({
        functionName: "createToken",
        args: [ipfsHash, parseEther(nftPrice)],
        value: listPrice,
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      notification.error(`Failed to mint NFT. Please try again`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-black bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 flex flex-col md:flex-row gap-6">
        {/* Image Upload and Display */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">Upload NFT Image</h2>
          <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Uploaded"
                width={400}
                height={400}
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <p className="text-gray-400">No image uploaded</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            disabled={uploadingToIPFS || isMinting || isConfirming}
          />
        </div>

        {/* Sidebar with Wallet, Created Images and Token Details */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          {/* Created Images */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Your Created Images</h3>
            <div className="max-h-32 overflow-y-auto mb-4">
              {loading ? (
                <p className="text-gray-400">Loading images...</p>
              ) : createdImages.length > 0 ? (
                createdImages.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    width={400}
                    height={400}
                    alt={`Created ${index}`}
                    className="w-full h-20 object-cover rounded-lg mb-2"
                  />
                ))
              ) : (
                <p className="text-gray-400">No images created yet</p>
              )}
            </div>

            {/* Token Details */}
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="nftName" className="block text-white font-medium mb-1">
                  NFT Name
                </label>
                <input
                  id="nftName"
                  value={nftName}
                  onChange={e => setNftName(e.target.value)}
                  placeholder="Enter NFT name..."
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploadingToIPFS || isMinting || isConfirming}
                />
              </div>

              <div>
                <label htmlFor="nftDescription" className="block text-white font-medium mb-1">
                  NFT Description
                </label>
                <textarea
                  id="nftDescription"
                  value={nftDescription}
                  onChange={e => setNftDescription(e.target.value)}
                  placeholder="Enter NFT description..."
                  className="w-full h-24 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploadingToIPFS || isMinting || isConfirming}
                />
              </div>

              <div>
                <label htmlFor="nftPrice" className="block text-white font-medium mb-1">
                  NFT Price (ETH)
                </label>
                <input
                  id="nftPrice"
                  type="number"
                  step="0.001"
                  min="0"
                  value={nftPrice}
                  onChange={e => setNftPrice(e.target.value)}
                  placeholder="Enter price in ETH..."
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={uploadingToIPFS || isMinting || isConfirming}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUploadToIPFS}
                  disabled={!imageFile || !nftName || !nftDescription || uploadingToIPFS || isMinting || isConfirming}
                  className={`flex-1 py-2 rounded-lg font-semibold text-white ${
                    imageFile && nftName && nftDescription && !uploadingToIPFS && !isMinting && !isConfirming
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {uploadingToIPFS ? "Uploading..." : "Upload to IPFS"}
                </button>

                <button
                  onClick={handleMint}
                  disabled={
                    !ipfsHash || !nftName || !nftDescription || !nftPrice || !isConnected || isMinting || isConfirming
                  }
                  className={`flex-1 py-2 rounded-lg font-semibold text-white ${
                    ipfsHash && nftName && nftDescription && nftPrice && isConnected && !isMinting && !isConfirming
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isMinting ? "Minting..." : isConfirming ? "Confirming..." : "Mint NFT"}
                </button>
              </div>

              {/* Status Messages */}
              {mintError && (
                <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-3">
                  <p className="text-red-300 text-sm">Error: {mintError.message}</p>
                </div>
              )}

              {hash && (
                <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-3">
                  <p className="text-green-300 text-sm">
                    Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNFT;
