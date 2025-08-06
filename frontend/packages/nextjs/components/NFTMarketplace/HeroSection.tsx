"use client";

import React from "react";

export const HeroSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Welcome to Our
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            NFT Project!
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Our platform is an innovative solution for creating, buying, and selling unique NFTs (non-fungible tokens). We
          combine a user-friendly interface, cutting-edge image generation technology, and the power of the Ethereum
          blockchain to make creating and trading digital assets simple, secure, and exciting. Our ecosystem consists of
          three core components, each designed to streamline your NFT journey.
        </p>
      </div>
    </section>
  );
};
