"use client";

import React from "react";

export const CallToAction = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-purple-600/30 to-pink-600/30">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Ready to Start Your NFT Journey?</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join our platform today and experience the future of digital asset creation and trading.
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Get Started Now
        </button>
      </div>
    </section>
  );
};
