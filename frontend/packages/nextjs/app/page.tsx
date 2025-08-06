"use client";

import { BalanceManager } from "../components/NFTMarketplace/BalanceManager";
import { CallToAction } from "../components/NFTMarketplace/CallToAction";
import { EcosystemComponents } from "../components/NFTMarketplace/EcosystemComponents";
// import { Footer } from "../components/NFTMarketplace/Footer";
// import { Header } from "./components/Header";
import { HeroSection } from "../components/NFTMarketplace/HeroSection";
import { HowToGetStarted } from "../components/NFTMarketplace/HowToGetStarted";
import { WhyChooseUs } from "../components/NFTMarketplace/WhyChooseUs";
import type { NextPage } from "next";

// import { useAccount } from "wagmi";
// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <HeroSection />
        <EcosystemComponents />
        <BalanceManager />
        <WhyChooseUs />
        <HowToGetStarted />
        <CallToAction />
      </div>
    </>
  );
};

export default Home;
