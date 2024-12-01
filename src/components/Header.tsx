import React from 'react';

const Header = () => {
  return (
    <nav className=" max-w-7xl mx-auto bg-transparent py-4 px-6 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/">
          <img src="src/logo.svg" alt="logo" className="h-8 w-auto" />
        </a>
        <div className="flex space-x-4 text-sm items-center">
          {/* <a href="/" className="text-gray-400 hover:text-black">
            Home
          </a>
          <a href="/introduce" className="text-gray-400 hover:text-black">
          Introduce
          </a> */}
          <button className="bg-black hover:bg-[#D06A48] hover:text-white text-white font-medium py-2 px-4 rounded-none">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;