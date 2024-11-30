import React from 'react';

const NavigationBar = () => {
  return (
    <nav className=" max-w-7xl mx-auto bg-transparent py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/">
          <img src="/logo.svg" alt="logo" className="h-8 w-auto" />
        </a>
        <div className="flex space-x-4 text-sm items-center">
          <a href="/" className="text-gray-400 hover:text-black">
            Home
          </a>
          <a href="/introduce" className="text-gray-400 hover:text-black">
          Introduce
          </a>
          <button className="bg-black hover:bg-gray-100 hover:text-black text-white font-bold py-2 px-4 rounded-none border-black">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;