import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section
      className="bg-white py-20 px-4 sm:px-6 lg:px-8 bg-[url('/images/hero-background.jpg')] bg-cover bg-center"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
        Swap Crypto Seamlessly with <br/>
        a Secure and Reliable Platform
        </h1>
        <p className="mt-6 text-xl text-gray-500">
          Unlock the world of cryptocurrency with tools and insights designed to make your swapping experience fast, secure, and hassle-free.
        </p>
        <div className="mt-10">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-none shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Welcome to Agoricswap!
            </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;