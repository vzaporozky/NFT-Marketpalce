"use client";

import React from "react";

export const HowToGetStarted = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">How to Get Started?</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start space-x-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Connect your cryptocurrency wallet</h3>
                <p className="text-gray-300">Connect your cryptocurrency wallet (e.g., MetaMask) on our website.</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Fund your balance</h3>
                <p className="text-gray-300">
                  Fund your balance via the Balance Manager to cover image generation costs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Generate a unique image</h3>
                <p className="text-gray-300">Generate a unique image using our server.</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-yellow-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Mint an NFT and list it for sale</h3>
                <p className="text-gray-300">
                  Mint an NFT based on your image and list it for sale on our marketplace.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-pink-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">5</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Buy or sell tokens</h3>
                <p className="text-gray-300">Buy or sell tokens, tracking all transactions in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
