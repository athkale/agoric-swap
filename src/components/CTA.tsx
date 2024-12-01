import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-black/30">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Redefine Digital Identity?</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of users who have already taken control of their digital identity with XDigi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center group">
            Get Started with XDigi
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}