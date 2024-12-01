import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Create Your DID',
    description: 'Sign up and generate a unique, secure decentralized identifier.',
  },
  {
    number: '02',
    title: 'Obtain Credentials',
    description: 'Receive verifiable credentials from trusted issuers.',
  },
  {
    number: '03',
    title: 'Verify Anywhere',
    description: 'Share credentials across platforms with full privacy control.',
  },
  {
    number: '04',
    title: 'Stay Secure',
    description: 'Manage your identity through your personal wallet.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">How Does XDigi Work?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="p-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300">
                <span className="text-5xl font-bold text-blue-400 opacity-50">{step.number}</span>
                <h3 className="text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}