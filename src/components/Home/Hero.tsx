import React from 'react';

{/* <img
        src="/hero_bg.png"
        alt="Hero Background"
        className="w-full h-full object-"
        style={{ maxHeight: '700px' }}
      /> */}

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden " >
      
      <div className="max-w-7xl mx-auto ">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="tracking-normal font-extrabold text-gray-900 text-6xl">
                <span className="block xl:inline pb-4">Empower Your</span>
                <br />{' '}
                <span className="block xl:inline pb-4">Crypto Journey with</span>{' '}
                <span className="block xl:inline pb-4">Cross-Chain Lending</span>
              </h1>
              <p className="mt-3 text-sm text-gray-500 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
                Seamlessly access liquidity across multiple blockchains with our secure and reliable
                cross-chain lending platform. Unlock the potential of your digital assets while
                enjoying flexibility, speed, and transparency like never before.
              </p>
              <a href="/login" rel="noopener noreferrer">
              <button className="bg-black text-white py-3 px-8 rounded-none text-sm font-normal mr-auto mt-8 hover:bg-[#D06A48] hover:text-white">
                GET STARTED
              </button>
            </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;