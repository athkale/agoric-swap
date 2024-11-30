import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-gray-500">&copy; 2024 Agoric XchainLend</p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Privacy policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Terms of services
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;