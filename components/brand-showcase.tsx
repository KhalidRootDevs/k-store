import Image from 'next/image';

const brands = [
  {
    name: 'TechGear',
    logo: '/placeholder.svg?height=60&width=120&text=TechGear'
  },
  {
    name: 'FashionHub',
    logo: '/placeholder.svg?height=60&width=120&text=FashionHub'
  },
  {
    name: 'HomeStyle',
    logo: '/placeholder.svg?height=60&width=120&text=HomeStyle'
  },
  {
    name: 'SportsPro',
    logo: '/placeholder.svg?height=60&width=120&text=SportsPro'
  },
  {
    name: 'BeautyEssentials',
    logo: '/placeholder.svg?height=60&width=120&text=Beauty'
  },
  {
    name: 'UrbanWear',
    logo: '/placeholder.svg?height=60&width=120&text=UrbanWear'
  }
];

export function BrandShowcase() {
  return (
    <div className="py-8">
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Trusted by leading brands worldwide
      </p>
      <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center grayscale transition-all hover:grayscale-0"
          >
            <Image
              src={brand.logo || '/placeholder.svg'}
              alt={brand.name}
              width={120}
              height={60}
              className="object-contain opacity-60 transition-opacity hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
