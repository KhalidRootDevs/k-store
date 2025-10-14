import { Package, Users, Star, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "10,000+",
    label: "Products Available",
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Customers",
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "Average Rating",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Customer Satisfaction",
  },
];

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <stat.icon className="h-6 w-6 text-primary" />
          </div>
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
