"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-foreground/10 mb-6">
          <Mail className="h-8 w-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay in the Loop
        </h2>
        <p className="text-lg mb-8 text-primary-foreground/90">
          Subscribe to our newsletter for exclusive deals, new arrivals, and
          style inspiration delivered to your inbox.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 flex-1"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            className="font-semibold"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-xs text-primary-foreground/70 mt-4">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates.
        </p>
      </div>
    </div>
  );
}
