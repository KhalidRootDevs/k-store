import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Buyer",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Amazing quality and fast shipping! The products exceeded my expectations. Will definitely shop here again.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Verified Buyer",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Best online shopping experience I've had. Great customer service and the products are exactly as described.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Verified Buyer",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Love the variety of products! Everything arrived in perfect condition and the prices are unbeatable.",
  },
];

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {testimonial.text}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
