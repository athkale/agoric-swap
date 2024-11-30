"use client";

import { useAccount } from "wagmi";
import Hero from "@/components/Hero";
import { useRouter } from "next/navigation"; // Updated import for client-side navigation
import { useEffect } from "react";

const Home: React.FC = () => {
  const { isConnected } = useAccount();
  const router = useRouter(); // Use useRouter for client-side navigation

  useEffect(() => {
    if (isConnected) {
      router.push(`/user/dashboard`); // Use router.push for navigation
    }
  }, [isConnected, router]);

  return (
    <main className="h-screen bg-[#FCFAF6] dark:bg-[#1a1a1a]">
      {" "}
      {/* Added dark mode support */}
      <div className="w-full max-w-7xl mx-auto py-8 flex justify-between items-center">
        <p className="text-[26px] font-bold text-left uppercase">
          <span className="text-[#222] dark:text-white">Safe</span> {""}
          <span className="text-[#4eb680]">
            {"{"}Connect{"}"}
          </span>
        </p>
        <div className="flex gap-6">
          <p className="text-normal font-light text-left text-[#222] dark:text-[#ccc]">
            Features
          </p>{" "}
          {/* Added dark mode support */}
          <p className="text-normal font-light text-left text-[#222] dark:text-[#ccc]">
            Company
          </p>{" "}
          {/* Added dark mode support */}
        </div>
        <div className="flex gap-2">
          <div className="flex justify-center items-center">
            {!isConnected ? (
              <w3m-connect-button size="sm" />
            ) : (
              <>
                <w3m-network-button />
                <w3m-account-button balance={"show"} />
              </>
            )}
          </div>
        </div>
      </div>
      <Hero isConnected={isConnected} />
    </main>
  );
};

export default Home;
