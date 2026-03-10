import { BannerSlider } from '@/components/banner-slider';
import { OfferBanner } from '@/components/offer-banner';
import { ProductGrid } from '@/components/product-grid';
import { PromotionalBanner } from '@/components/promotional-banner';
import { TopCategories } from '@/components/top-categories';
import { ValuePropositions } from '@/components/value-propositions';
import { BrandShowcase } from '@/components/brand-showcase';
import { StatsSection } from '@/components/stats-section';
import { Testimonials } from '@/components/testimonials';
import { NewsletterSection } from '@/components/newsletter-section';
import { CTABanner } from '@/components/cta-banner';
import { RecentlyViewed } from '@/components/recently-viewed';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-0">
        <BannerSlider />
      </section>

      <section className="container mx-auto border-b py-12">
        <ValuePropositions />
      </section>

      {/* Top Categories */}
      <section className="container mx-auto py-12">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Shop by Category
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          Browse our curated collections and find exactly what you need
        </p>
        <TopCategories />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-12">
        <h2 className="mb-2 text-center text-3xl font-bold">
          Featured Products
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          Hand-picked items just for you
        </p>
        <ProductGrid type="featured" />
      </section>

      {/* Offer Banner */}
      <section className="py-6">
        <OfferBanner />
      </section>

      <section className="container mx-auto my-8 rounded-2xl bg-muted/30 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Why Shop With Us
        </h2>
        <StatsSection />
      </section>

      {/* Best Selling Products */}
      <section className="container mx-auto py-12">
        <h2 className="mb-2 text-center text-3xl font-bold">Best Sellers</h2>
        <p className="mb-8 text-center text-muted-foreground">
          Our most popular products loved by customers
        </p>
        <ProductGrid type="best-selling" />
      </section>

      <section className="container mx-auto border-y py-12">
        <BrandShowcase />
      </section>

      {/* Top Rated Products */}
      <section className="container mx-auto py-12">
        <h2 className="mb-2 text-center text-3xl font-bold">Top Rated</h2>
        <p className="mb-8 text-center text-muted-foreground">
          Highest rated products by our community
        </p>
        <ProductGrid type="top-rated" />
      </section>

      {/* Promotional Banner */}
      <section className="py-6">
        <PromotionalBanner />
      </section>

      <section className="container mx-auto py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">
          What Our Customers Say
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Real reviews from real customers
        </p>
        <Testimonials />
      </section>

      <section className="container mx-auto">
        <RecentlyViewed />
      </section>

      <section className="container mx-auto py-12">
        <CTABanner />
      </section>

      <section className="container mx-auto py-12">
        <NewsletterSection />
      </section>
    </div>
  );
}
