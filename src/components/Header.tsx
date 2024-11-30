"use client";

import { useAccount } from "wagmi";

const Header: React.FC = () => {
  const { isConnected } = useAccount();

  return (
    <header className="w-full py-4 px-8 bg-[#FCFAF6] dark:bg-gray-900 flex justify-between items-center " aria-label="Dashboard Header">
      <div className="flex items-center">
        <p className="text-[26px] font-bold text-left uppercase">
          <span className="text-[#222] dark:text-white">Safe</span> {""}
          <span className="text-[#4eb680]">
            {"{"}Connect{"}"}
          </span>
        </p>
      </div>
      {/* <div className="flex items-center gap-x-4">
        {isConnected ? (
          <w3m-connect-button aria-label="Connect Wallet" />
        ) : (
          <>
            <w3m-network-button aria-label="Network" />
            <w3m-account-button balance={"show"} aria-label="Account" />
          </>
        )}
      </div> */}
    </header>
  );
};

export default Header;
