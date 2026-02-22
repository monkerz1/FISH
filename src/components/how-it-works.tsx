import { Search, Zap, Heart } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Search your city or zip',
    description: 'Enter your location to find aquarium shops near you',
    icon: Search,
  },
  {
    number: 2,
    title: 'Browse verified fish stores',
    description: 'Explore ratings, specialties, and store information',
    icon: Zap,
  },
  {
    number: 3,
    title: 'Visit and support your local LFS',
    description: 'Help your community by shopping local',
    icon: Heart,
  },
];

export function HowItWorks() {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="text-lg text-gray-600">Finding your local fish store is easy</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A90D9] text-white">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {step.number < 3 && (
                  <div className="mt-8 hidden h-1 w-12 bg-[#4A90D9] md:block" style={{
                    margin: '2rem auto 0',
                    width: '2rem',
                    height: '0.25rem',
                  }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
