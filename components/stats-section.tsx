import { Package, Users, Star, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Package,
    value: '10,000+',
    label: 'Products Available'
  },
  {
    icon: Users,
    value: '50,000+',
    label: 'Happy Customers'
  },
  {
    icon: Star,
    value: '4.8/5',
    label: 'Average Rating'
  },
  {
    icon: TrendingUp,
    value: '98%',
    label: 'Customer Satisfaction'
  }
];

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <stat.icon className="h-6 w-6 text-primary" />
          </div>
          <div className="mb-1 text-3xl font-bold">{stat.value}</div>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
