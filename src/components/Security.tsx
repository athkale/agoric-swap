import React from 'react';
import { Shield, Lock, Key } from 'lucide-react';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Blockchain-Based Security',
    description: 'Immutable, tamper-proof identity storage.',
  },
  {
    icon: Lock,
    title: 'Zero-Knowledge Proofs',
    description: 'Share only what is necessary, keep the rest private.',
  },
  {
    icon: Key,
    title: 'Encrypted Wallets',
    description: 'Protect credentials with industry-leading encryption.',
  },
];

export default function Security() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Security and Privacy at the Core of XDigi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 mb-6 text-blue-400" />
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}