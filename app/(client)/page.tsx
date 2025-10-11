import { BannerSlider } from "@/components/banner-slider";
import { OfferBanner } from "@/components/offer-banner";
import { ProductGrid } from "@/components/product-grid";
import { PromotionalBanner } from "@/components/promotional-banner";
import { TopCategories } from "@/components/top-categories";
import { ValuePropositions } from "@/components/value-propositions";
import { BrandShowcase } from "@/components/brand-showcase";
import { StatsSection } from "@/components/stats-section";
import { Testimonials } from "@/components/testimonials";
import { NewsletterSection } from "@/components/newsletter-section";
import { CTABanner } from "@/components/cta-banner";
import { RecentlyViewed } from "@/components/recently-viewed";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-0">
        <BannerSlider />
      </section>

      <section className="container mx-auto py-12 border-b">
        <ValuePropositions />
      </section>

      {/* Top Categories */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Shop by Category
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Browse our curated collections and find exactly what you need
        </p>
        <TopCategories />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Featured Products
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Hand-picked items just for you
        </p>
        <ProductGrid type="featured" />
      </section>

      {/* Offer Banner */}
      <section className="py-6">
        <OfferBanner />
      </section>

      <section className="container mx-auto py-16 bg-muted/30 rounded-2xl my-8">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Why Shop With Us
        </h2>
        <StatsSection />
      </section>

      {/* Best Selling Products */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-2 text-center">Best Sellers</h2>
        <p className="text-center text-muted-foreground mb-8">
          Our most popular products loved by customers
        </p>
        <ProductGrid type="best-selling" />
      </section>

      <section className="container mx-auto py-12 border-y">
        <BrandShowcase />
      </section>

      {/* Top Rated Products */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-2 text-center">Top Rated</h2>
        <p className="text-center text-muted-foreground mb-8">
          Highest rated products by our community
        </p>
        <ProductGrid type="top-rated" />
      </section>

      {/* Promotional Banner */}
      <section className="py-6">
        <PromotionalBanner />
      </section>

      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-bold mb-2 text-center">
          What Our Customers Say
        </h2>
        <p className="text-center text-muted-foreground mb-12">
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
