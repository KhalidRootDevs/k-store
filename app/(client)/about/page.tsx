"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

// This would typically come from an API or CMS
const defaultAboutContent = {
  title: "About single vendor",
  subtitle: "Your Trusted Shopping Destination",
  mainContent: `
    <p>Welcome to single vendor, where shopping meets convenience and quality. Established in 2023, we've quickly grown to become a trusted name in online retail.</p>
    
    <h2>Our Story</h2>
    <p>single vendor was founded with a simple mission: to make online shopping easy, enjoyable, and accessible to everyone. What started as a small venture has now grown into a comprehensive e-commerce platform offering thousands of products across multiple categories.</p>
    
    <h2>Our Values</h2>
    <p>At single vendor, we believe in:</p>
    <ul>
      <li><strong>Quality:</strong> We carefully curate our product selection to ensure only the best items make it to our store.</li>
      <li><strong>Customer Satisfaction:</strong> Your happiness is our priority. We strive to provide exceptional service at every step.</li>
      <li><strong>Transparency:</strong> Clear pricing, honest product descriptions, and no hidden fees.</li>
      <li><strong>Sustainability:</strong> We're committed to reducing our environmental footprint through eco-friendly packaging and responsible sourcing.</li>
    </ul>
    
    <h2>Our Team</h2>
    <p>Behind single vendor is a dedicated team of professionals passionate about e-commerce and customer service. From our product specialists to our customer support representatives, everyone works together to ensure you have the best shopping experience.</p>
    
    <h2>Looking Forward</h2>
    <p>As we continue to grow, we remain committed to our core values and to bringing you the best products at competitive prices. We're constantly expanding our catalog and improving our services based on your feedback.</p>
    
    <p>Thank you for choosing single vendor. We look forward to serving you and exceeding your expectations.</p>
  `,
  updatedAt: "2023-10-15",
};

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<
    typeof defaultAboutContent | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call to fetch content
    // For demo purposes, we'll simulate an API call with a timeout
    const fetchContent = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAboutContent(defaultAboutContent);
      } catch (error) {
        console.error("Failed to fetch about content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <>
      <Container>
        <div className="container mx-auto">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-3">{aboutContent?.title}</h1>
              <p className="text-xl text-muted-foreground mb-8">
                {aboutContent?.subtitle}
              </p>
              <div
                className="prose max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: aboutContent?.mainContent || "",
                }}
              />
              <p className="text-sm text-muted-foreground mt-8">
                Last updated: {aboutContent?.updatedAt}
              </p>
            </>
          )}
        </div>
      </Container>
    </>
  );
}
