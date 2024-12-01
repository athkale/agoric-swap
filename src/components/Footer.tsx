import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#F6F6FE]">XDigi</h3>
            <p className="text-[#F6F6FE]">
              Empowering digital identity for everyone, everywhere.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#F6F6FE]">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#F6F6FE] hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-[#F6F6FE] hover:text-white transition-colors">Use Cases</a></li>
              <li><a href="#" className="text-[#F6F6FE] hover:text-white transition-colors">Developers</a></li>
              <li><a href="#" className="text-[#F6F6FE] hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#F6F6FE]">Contact</h4>
            <p className="text-[#F6F6FE]">support@XDigi.com</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-[#F6F6FE] hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#F6F6FE] hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#F6F6FE] hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#F6F6FE]">Newsletter</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-white/10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
              />
                <button className="px-4 py-2 bg-[#D06A48] rounded-none hover:bg-[#D06A48] transition-colors text-[#F6F6FE]">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} XDigi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}