"use client";

import React from "react";
import { BoltIcon, ChartBarIcon, CurrencyDollarIcon, WalletIcon } from "@heroicons/react/24/outline";

export const BalanceManager = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 border border-white/20">
          <div className="flex items-center justify-center mb-8">
            <WalletIcon className="h-16 w-16 text-yellow-400 mr-4" />
            <h2 className="text-4xl font-bold text-white">Balance Manager for Seamless Payments</h2>
          </div>
          <p className="text-xl text-gray-300 text-center mb-8 max-w-4xl mx-auto">
            To simplify payments for services like image generation, weve developed a dedicated Balance Manager smart
            contract. It allows you to:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <CurrencyDollarIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Fund your platform balance</h3>
              <p className="text-gray-400">Add funds securely to cover platform services</p>
            </div>
            <div className="text-center">
              <BoltIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Pay for image generation and other services</h3>
              <p className="text-gray-400">Seamless payment processing for all platform features</p>
            </div>
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Transparently track your spending and available funds
              </h3>
              <p className="text-gray-400">Monitor your balance and transaction history</p>
            </div>
          </div>
          <p className="text-gray-300 text-center mt-8 italic">
            The Balance Manager is integrated with the website, enabling easy financial management directly from the
            interface.
          </p>
        </div>
      </div>
    </section>
  );
};
