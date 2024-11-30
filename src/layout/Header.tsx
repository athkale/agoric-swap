import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center p-6">
      <div className="flex items-center space-x-8">
        <Image
          src="/logo.svg"
          alt="Agoric"
          width={120}
          height={120}
        />
        
      </div>
      <Link href="/login">
        {/* Changed font size to small */}
        <span className="bg-black text-white py-3 px-6 rounded-none text-sm font-normal mr-auto">
          CONNECT WALLET
        </span>
      </Link>
    </nav>
  );
};

export default Header;
