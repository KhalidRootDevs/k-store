import Image from "next/image";

const brands = [
  {
    name: "TechGear",
    logo: "/placeholder.svg?height=60&width=120&text=TechGear",
  },
  {
    name: "FashionHub",
    logo: "/placeholder.svg?height=60&width=120&text=FashionHub",
  },
  {
    name: "HomeStyle",
    logo: "/placeholder.svg?height=60&width=120&text=HomeStyle",
  },
  {
    name: "SportsPro",
    logo: "/placeholder.svg?height=60&width=120&text=SportsPro",
  },
  {
    name: "BeautyEssentials",
    logo: "/placeholder.svg?height=60&width=120&text=Beauty",
  },
  {
    name: "UrbanWear",
    logo: "/placeholder.svg?height=60&width=120&text=UrbanWear",
  },
];

export function BrandShowcase() {
  return (
    <div className="py-8">
      <p className="text-center text-sm text-muted-foreground mb-8">
        Trusted by leading brands worldwide
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center grayscale hover:grayscale-0 transition-all"
          >
            <Image
              src={brand.logo || "/placeholder.svg"}
              alt={brand.name}
              width={120}
              height={60}
              className="object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
