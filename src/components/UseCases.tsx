import React from 'react';

const useCases = [
  {
    title: 'For Students',
    description: 'Store and share academic credentials globally.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'For Employees',
    description: 'Seamlessly verify professional qualifications.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'For Developers',
    description: 'Integrate XDigi into your dApps effortlessly.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'For Businesses',
    description: 'Simplify KYC processes and build trust with customers.',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80',
  },
];

export default function UseCases() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Designed for Everyone, Everywhere</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={useCase.image}
                alt={useCase.title}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{useCase.title}</h3>
                <p className="text-gray-200">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}