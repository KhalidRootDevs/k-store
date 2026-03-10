import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50'
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer service'
  },
  {
    icon: CreditCard,
    title: 'Easy Returns',
    description: '30-day money back guarantee'
  }
];

export function ValuePropositions() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <feature.icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
