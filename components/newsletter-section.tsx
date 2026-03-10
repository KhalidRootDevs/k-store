'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Successfully subscribed!',
        description: 'Thank you for subscribing to our newsletter.'
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10">
          <Mail className="h-8 w-8" />
        </div>
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Stay in the Loop
        </h2>
        <p className="mb-8 text-lg text-primary-foreground/90">
          Subscribe to our newsletter for exclusive deals, new arrivals, and
          style inspiration delivered to your inbox.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            className="font-semibold"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-primary-foreground/70">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates.
        </p>
      </div>
    </div>
  );
}
