"use client";

import React from "react";
import {
  BoltIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PhotoIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const WhyChooseUs = () => {
  return (
    <section className="py-16 px-6 bg-black/20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <BoltIcon className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Simplicity</h3>
            <p className="text-gray-300">
              An intuitive interface makes NFT creation and trading accessible to everyone.
            </p>
          </div>
          <div className="text-center">
            <GlobeAltIcon className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Decentralization</h3>
            <p className="text-gray-300">
              Using IPFS and the Ethereum blockchain ensures reliability and independence from centralized servers.
            </p>
          </div>
          <div className="text-center">
            <RectangleStackIcon className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Flexibility</h3>
            <p className="text-gray-300">Create, generate, and trade NFTs on your terms.</p>
          </div>
          <div className="text-center">
            <ShieldCheckIcon className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Security</h3>
            <p className="text-gray-300">
              Our smart contracts are thoroughly tested and built with industry-standard practices to protect your
              assets.
            </p>
          </div>
          <div className="text-center">
            <PhotoIcon className="h-16 w-16 text-pink-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
            <p className="text-gray-300">
              Our image generation server lets you create unique content without design skills.
            </p>
          </div>
          <div className="text-center">
            <LockClosedIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Trust</h3>
            <p className="text-gray-300">Transparent fees and secure transactions you can rely on.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
