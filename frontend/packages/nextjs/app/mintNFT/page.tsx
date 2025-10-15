"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const MintNFT: NextPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftPrice, setNftPrice] = useState("0.001");
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | number | null>(null);

  const { address, isConnected } = useAccount();

  const { data: listPrice } = useScaffoldReadContract({
    contractName: "NFTMarketplace",
    functionName: "getListPrice",
  });

  const { data: creationPrice, isLoading: priceLoading } = useScaffoldReadContract({
    contractName: "BalanceManager",
    functionName: "getPrice",
  });
  const { data: userBalance, isLoading: balanceLoading } = useScaffoldReadContract({
    contractName: "BalanceManager",
    functionName: "getBalance",
    args: [address || "0x0000000000000000000000000000000000000000"],
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
    if (isSuccess) {
      setImageFile(null);
      setActivePhoto(null);
      setIpfsHash(null);
      setNftName("");
      setNftDescription("");
      setNftPrice("0.1");

      notification.success(`NFT minted successfully! Transaction hash: ${hash}`);
    }
  }, [isSuccess, hash]);

  const base64ToFile = (base64String: string): File => {
    const byteString = atob(base64String.replace(/^data:image\/jpeg;base64,/, ""));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
    return new File([blob], nftName, { type: "image/jpeg" });
  };

  const handleSetActivePhoto = (index: number) => {
    setActivePhoto(index);
    const file = base64ToFile(userPhotos[index]);
    setImageFile(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setActivePhoto(URL.createObjectURL(file));
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

      const linkMetadataData = await metadataResponse.json();

      setIpfsHash(linkMetadataData.link);
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

  useEffect(() => {
    const loadUserPhotos = async () => {
      if (!address) return;

      const userAddress = address;

      setLoadingPhotos(true);
      try {
        const resPhotos = await fetch("/api/photos-get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userAddress }),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-black bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">Upload NFT Image</h2>
          <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            {activePhoto !== null ? (
              <Image
                src={typeof activePhoto === "number" ? userPhotos[activePhoto] : activePhoto}
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

        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
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
            <h3 className="text-lg font-semibold text-white mb-4">Your Created Images</h3>
            <div className="max-h-32 overflow-y-auto mb-4">
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
                      onClick={() => handleSetActivePhoto(index)}
                      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-square">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                  className={`flex-1 py-2 rounded-lg font-semibold text-white  ${
                    imageFile && nftName && nftDescription && !uploadingToIPFS && !isMinting && !isConfirming
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
                  className={`flex-1 py-2 rounded-lg font-semibold text-white  ${
                    ipfsHash && nftName && nftDescription && nftPrice && isConnected && !isMinting && !isConfirming
                      ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isMinting ? "Minting..." : isConfirming ? "Confirming..." : "Mint NFT"}
                </button>
              </div>

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
