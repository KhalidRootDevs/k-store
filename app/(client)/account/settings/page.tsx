'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Mail, ShoppingBag, Heart, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    newsletter: true,
    promotionalEmails: true,
    orderUpdates: true,
    newArrivals: false,
    priceDrops: true,
    wishlistUpdates: false,
    smsNotifications: false
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="newsletter" className="cursor-pointer">
                  Newsletter
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive our weekly newsletter with updates and tips
                </p>
              </div>
            </div>
            <Switch
              id="newsletter"
              checked={settings.newsletter}
              onCheckedChange={() => handleToggle('newsletter')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <ShoppingBag className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="promotional" className="cursor-pointer">
                  Promotional Emails
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about sales, offers, and promotions
                </p>
              </div>
            </div>
            <Switch
              id="promotional"
              checked={settings.promotionalEmails}
              onCheckedChange={() => handleToggle('promotionalEmails')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="orderUpdates" className="cursor-pointer">
                  Order Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your order status and shipping
                </p>
              </div>
            </div>
            <Switch
              id="orderUpdates"
              checked={settings.orderUpdates}
              onCheckedChange={() => handleToggle('orderUpdates')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Notifications</CardTitle>
          <CardDescription>
            Stay updated about products you care about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <ShoppingBag className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="newArrivals" className="cursor-pointer">
                  New Arrivals
                </Label>
                <p className="text-sm text-muted-foreground">
                  Be the first to know about new products
                </p>
              </div>
            </div>
            <Switch
              id="newArrivals"
              checked={settings.newArrivals}
              onCheckedChange={() => handleToggle('newArrivals')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="priceDrops" className="cursor-pointer">
                  Price Drops
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get alerts when prices drop on products you viewed
                </p>
              </div>
            </div>
            <Switch
              id="priceDrops"
              checked={settings.priceDrops}
              onCheckedChange={() => handleToggle('priceDrops')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Heart className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="wishlistUpdates" className="cursor-pointer">
                  Wishlist Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notifications about items in your wishlist (stock, price
                  changes)
                </p>
              </div>
            </div>
            <Switch
              id="wishlistUpdates"
              checked={settings.wishlistUpdates}
              onCheckedChange={() => handleToggle('wishlistUpdates')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>
            Receive text messages for important updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="smsNotifications" className="cursor-pointer">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive text messages for order updates and delivery
                  notifications
                </p>
              </div>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle('smsNotifications')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
}
