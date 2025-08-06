"use client";

import React from "react";
import {
  ArrowUpTrayIcon,
  BoltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  PhotoIcon,
  RectangleStackIcon,
  ServerIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

export const EcosystemComponents = () => {
  return (
    <section className="py-16 px-6 bg-black/20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Our Ecosystem Components</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Website Component */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center mb-6">
              <GlobeAltIcon className="h-12 w-12 text-blue-400 mr-4" />
              <h3 className="text-2xl font-bold text-white">1. Intuitive Website</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Our website is your gateway to the world of NFTs. Through a modern and easy-to-use interface, you can:
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ArrowUpTrayIcon className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Create NFTs</h4>
                  <p className="text-gray-400 text-sm">
                    Upload data, generate unique tokens, and list them on our marketplace.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShoppingCartIcon className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Buy and Sell</h4>
                  <p className="text-gray-400 text-sm">
                    Browse collections, purchase NFTs, or list your tokens for sale with your desired price.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <WalletIcon className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Manage Your Balance</h4>
                  <p className="text-gray-400 text-sm">
                    Fund your wallet using our Balance Manager smart contract to pay for image generation and other
                    services.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ChartBarIcon className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Track Activity</h4>
                  <p className="text-gray-400 text-sm">
                    Receive real-time notifications about new tokens, sales, and other events through seamless
                    blockchain integration.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-6 italic">
              The website is designed for ease of use: you dont need to be a blockchain expert to get started. Simply
              connect your wallet (e.g., MetaMask) and dive into the world of digital collectibles!
            </p>
          </div>

          {/* Image Generation Server */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center mb-6">
              <ServerIcon className="h-12 w-12 text-green-400 mr-4" />
              <h3 className="text-2xl font-bold text-white">2. Image Generation Server</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Creating unique NFTs requires standout visuals. Our server is a powerful tool that generates high-quality
              images for your tokens. Heres how it works:
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <PhotoIcon className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Personalized Images</h4>
                  <p className="text-gray-400 text-sm">
                    Specify parameters (e.g., style, colors, or themes), and our server will create a unique image using
                    advanced algorithms.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Paid Service</h4>
                  <p className="text-gray-400 text-sm">
                    Image generation is a paid feature, with fees processed securely through our Balance Manager
                    contract, ensuring transparency.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RectangleStackIcon className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">IPFS Integration</h4>
                  <p className="text-gray-400 text-sm">
                    Generated images are uploaded to IPFS (InterPlanetary File System) for decentralized storage,
                    guaranteeing accessibility and reliability.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BoltIcon className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Flexibility</h4>
                  <p className="text-gray-400 text-sm">
                    Use the generated images as the foundation for your NFTs, incorporating them into your token
                    metadata.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-6 italic">
              Our server makes creating unique content accessible, even if youre not an artist!
            </p>
          </div>

          {/* Smart Contract */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="h-12 w-12 text-purple-400 mr-4" />
              <h3 className="text-2xl font-bold text-white">3. NFT Marketplace Smart Contract</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Our marketplace is powered by a secure Ethereum smart contract, ensuring transparency, security, and
              decentralization. Key features include:
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <PaintBrushIcon className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Create NFTs</h4>
                  <p className="text-gray-400 text-sm">
                    Mint your tokens with unique metadata (e.g., links to images on IPFS) using the createToken
                    function.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShoppingCartIcon className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Buy and Sell</h4>
                  <p className="text-gray-400 text-sm">
                    List your NFTs for sale with the listToken function and purchase tokens from others via executeSale.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BoltIcon className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Flexibility</h4>
                  <p className="text-gray-400 text-sm">
                    Create tokens and decide whether to list them immediately or later. The unlistToken function lets
                    you remove tokens from sale at any time.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Security</h4>
                  <p className="text-gray-400 text-sm">
                    The contract is protected against reentrancy attacks and leverages trusted OpenZeppelin libraries to
                    keep your assets safe.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-blue-200 text-sm">
                <strong>Transparent Fees:</strong> A small listing fee (listPrice) is charged per sale to support
                platform development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
