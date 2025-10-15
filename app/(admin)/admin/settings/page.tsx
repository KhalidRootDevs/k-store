"use client";

import type React from "react";

import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cloud, Eye, EyeOff, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Updated Zod Schema with Cloudinary
const settingsSchema = z.object({
  general: z.object({
    storeInfo: z.object({
      storeName: z.string().min(1, "Store name is required"),
      storeEmail: z.string().email("Invalid email address"),
      storePhone: z.string().min(1, "Phone number is required"),
      storeAddress: z.string().min(1, "Address is required"),
    }),
    seo: z.object({
      metaTitle: z.string().min(1, "Meta title is required"),
      metaDescription: z.string().min(1, "Meta description is required"),
      metaKeywords: z.string().min(1, "Meta keywords are required"),
    }),
    socialMedia: z.object({
      facebook: z.string().url("Invalid URL").or(z.literal("")),
      instagram: z.string().url("Invalid URL").or(z.literal("")),
      twitter: z.string().url("Invalid URL").or(z.literal("")),
      youtube: z.string().url("Invalid URL").or(z.literal("")),
    }),
  }),
  payment: z.object({
    paymentMethods: z.object({
      creditCards: z.boolean(),
      stripe: z.object({
        apiKey: z.string().optional(),
        secretKey: z.string().optional(),
      }),
      paypal: z.object({
        enabled: z.boolean(),
        clientId: z.string().optional(),
        secret: z.string().optional(),
      }),
      cashOnDelivery: z.boolean(),
    }),
    currency: z.object({
      defaultCurrency: z.enum(["usd", "eur", "gbp", "cad", "aud"]),
      currencyFormat: z.enum(["symbol", "code", "symbol-code"]),
    }),
    tax: z.object({
      enabled: z.boolean(),
      taxRate: z.number().min(0).max(100),
      pricesIncludeTax: z.boolean(),
    }),
  }),
  shipping: z.object({
    methods: z.object({
      freeShipping: z.object({
        enabled: z.boolean(),
        minimumAmount: z.number().min(0),
      }),
      flatRate: z.object({
        enabled: z.boolean(),
        cost: z.number().min(0),
      }),
      expressShipping: z.object({
        enabled: z.boolean(),
        cost: z.number().min(0),
      }),
    }),
    options: z.object({
      shippingCalculator: z.boolean(),
      internationalShipping: z.boolean(),
      shippingOrigin: z.string().min(1, "Shipping origin is required"),
    }),
  }),
  email: z.object({
    provider: z.object({
      service: z.enum(["smtp", "sendgrid", "mailchimp", "aws-ses"]),
      smtp: z
        .object({
          host: z.string().min(1, "SMTP host is required").optional(),
          port: z.number().min(1).max(65535).optional(),
          security: z.enum(["none", "ssl", "tls"]).optional(),
          username: z.string().optional(),
          password: z.string().optional(),
        })
        .optional(),
    }),
    notifications: z.object({
      orderConfirmation: z.boolean(),
      shippingConfirmation: z.boolean(),
      orderCanceled: z.boolean(),
      customerAccount: z.boolean(),
      passwordReset: z.boolean(),
      abandonedCart: z.boolean(),
    }),
  }),
  cms: z.object({
    termsAndConditions: z
      .string()
      .min(1, "Terms and conditions content is required"),
    privacyPolicy: z.string().min(1, "Privacy policy content is required"),
    returnPolicy: z.string().min(1, "Return policy content is required"),
    aboutUs: z.string().min(1, "About us content is required"),
    faq: z.string().min(1, "FAQ content is required"),
  }),
  advanced: z.object({
    analytics: z.object({
      googleAnalyticsId: z.string().optional(),
      facebookPixelId: z.string().optional(),
      enabled: z.boolean(),
    }),
    api: z.object({
      apiKey: z.string().min(1, "API key is required"),
      webhookUrl: z.string().url("Invalid URL").or(z.literal("")),
      webhooksEnabled: z.boolean(),
    }),
    cloudinary: z.object({
      cloudName: z.string().min(1, "Cloud name is required"),
      apiKey: z.string().min(1, "API key is required"),
      apiSecret: z.string().min(1, "API secret is required"),
      uploadPreset: z.string().optional(),
      secure: z.boolean(),
      folder: z.string().min(1, "Folder is required"),
    }),
    performance: z.object({
      pageCaching: z.boolean(),
      cacheDuration: z.number().min(1),
      imageOptimization: z.boolean(),
      minifyAssets: z.boolean(),
    }),
    maintenance: z.object({
      enabled: z.boolean(),
      message: z.string().min(1, "Maintenance message is required"),
      allowAdminAccess: z.boolean(),
    }),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logo, setLogo] = useState<string | null>(
    "/placeholder.svg?height=100&width=200"
  );
  const [favicon, setFavicon] = useState<string | null>(
    "/placeholder.svg?height=32&width=32"
  );
  const [showCloudinarySecrets, setShowCloudinarySecrets] = useState({
    apiKey: false,
    apiSecret: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      general: {
        storeInfo: {
          storeName: "",
          storeEmail: "",
          storePhone: "",
          storeAddress: "",
        },
        seo: {
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
        },
        socialMedia: {
          facebook: "",
          instagram: "",
          twitter: "",
          youtube: "",
        },
      },
      payment: {
        paymentMethods: {
          creditCards: true,
          stripe: {
            apiKey: "",
            secretKey: "",
          },
          paypal: {
            enabled: false,
            clientId: "",
            secret: "",
          },
          cashOnDelivery: true,
        },
        currency: {
          defaultCurrency: "usd",
          currencyFormat: "symbol",
        },
        tax: {
          enabled: false,
          taxRate: 0,
          pricesIncludeTax: false,
        },
      },
      shipping: {
        methods: {
          freeShipping: {
            enabled: false,
            minimumAmount: 0,
          },
          flatRate: {
            enabled: true,
            cost: 0,
          },
          expressShipping: {
            enabled: false,
            cost: 0,
          },
        },
        options: {
          shippingCalculator: true,
          internationalShipping: false,
          shippingOrigin: "",
        },
      },
      email: {
        provider: {
          service: "smtp",
          smtp: {
            host: "",
            port: 587,
            security: "tls",
            username: "",
            password: "",
          },
        },
        notifications: {
          orderConfirmation: true,
          shippingConfirmation: true,
          orderCanceled: true,
          customerAccount: true,
          passwordReset: true,
          abandonedCart: false,
        },
      },
      cms: {
        termsAndConditions: "",
        privacyPolicy: "",
        returnPolicy: "",
        aboutUs: "",
        faq: "",
      },
      advanced: {
        analytics: {
          googleAnalyticsId: "",
          facebookPixelId: "",
          enabled: false,
        },
        api: {
          apiKey: "",
          webhookUrl: "",
          webhooksEnabled: false,
        },
        cloudinary: {
          cloudName: "",
          apiKey: "",
          apiSecret: "",
          uploadPreset: "",
          secure: true,
          folder: "ecommerce",
        },
        performance: {
          pageCaching: true,
          cacheDuration: 3600,
          imageOptimization: true,
          minifyAssets: true,
        },
        maintenance: {
          enabled: false,
          message:
            "We're currently performing maintenance. Please check back later.",
          allowAdminAccess: true,
        },
      },
    },
  });

  // Fetch settings on component mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/settings");

        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const data = await response.json();

        if (data.settings) {
          // Transform the API response to match our form structure
          const transformedSettings = transformSettingsFromAPI(data.settings);
          reset(transformedSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings. Using default values.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, [reset]);

  // Transform API response to form structure
  const transformSettingsFromAPI = (apiSettings: any): SettingsFormData => {
    return {
      general: {
        storeInfo: {
          storeName: apiSettings.general?.storeInfo?.storeName || "",
          storeEmail: apiSettings.general?.storeInfo?.storeEmail || "",
          storePhone: apiSettings.general?.storeInfo?.storePhone || "",
          storeAddress: apiSettings.general?.storeInfo?.storeAddress || "",
        },
        seo: {
          metaTitle: apiSettings.general?.seo?.metaTitle || "",
          metaDescription: apiSettings.general?.seo?.metaDescription || "",
          metaKeywords: apiSettings.general?.seo?.metaKeywords || "",
        },
        socialMedia: {
          facebook: apiSettings.general?.socialMedia?.facebook || "",
          instagram: apiSettings.general?.socialMedia?.instagram || "",
          twitter: apiSettings.general?.socialMedia?.twitter || "",
          youtube: apiSettings.general?.socialMedia?.youtube || "",
        },
      },
      payment: {
        paymentMethods: {
          creditCards: apiSettings.payment?.paymentMethods?.creditCards ?? true,
          stripe: {
            apiKey: apiSettings.payment?.paymentMethods?.stripe?.apiKey || "",
            secretKey:
              apiSettings.payment?.paymentMethods?.stripe?.secretKey || "",
          },
          paypal: {
            enabled:
              apiSettings.payment?.paymentMethods?.paypal?.enabled ?? false,
            clientId:
              apiSettings.payment?.paymentMethods?.paypal?.clientId || "",
            secret: apiSettings.payment?.paymentMethods?.paypal?.secret || "",
          },
          cashOnDelivery:
            apiSettings.payment?.paymentMethods?.cashOnDelivery ?? true,
        },
        currency: {
          defaultCurrency:
            apiSettings.payment?.currency?.defaultCurrency || "usd",
          currencyFormat:
            apiSettings.payment?.currency?.currencyFormat || "symbol",
        },
        tax: {
          enabled: apiSettings.payment?.tax?.enabled ?? false,
          taxRate: apiSettings.payment?.tax?.taxRate || 0,
          pricesIncludeTax: apiSettings.payment?.tax?.pricesIncludeTax ?? false,
        },
      },
      shipping: {
        methods: {
          freeShipping: {
            enabled:
              apiSettings.shipping?.methods?.freeShipping?.enabled ?? false,
            minimumAmount:
              apiSettings.shipping?.methods?.freeShipping?.minimumAmount || 0,
          },
          flatRate: {
            enabled: apiSettings.shipping?.methods?.flatRate?.enabled ?? true,
            cost: apiSettings.shipping?.methods?.flatRate?.cost || 0,
          },
          expressShipping: {
            enabled:
              apiSettings.shipping?.methods?.expressShipping?.enabled ?? false,
            cost: apiSettings.shipping?.methods?.expressShipping?.cost || 0,
          },
        },
        options: {
          shippingCalculator:
            apiSettings.shipping?.options?.shippingCalculator ?? true,
          internationalShipping:
            apiSettings.shipping?.options?.internationalShipping ?? false,
          shippingOrigin: apiSettings.shipping?.options?.shippingOrigin || "",
        },
      },
      email: {
        provider: {
          service: apiSettings.email?.provider?.service || "smtp",
          smtp: {
            host: apiSettings.email?.provider?.smtp?.host || "",
            port: apiSettings.email?.provider?.smtp?.port || 587,
            security: apiSettings.email?.provider?.smtp?.security || "tls",
            username: apiSettings.email?.provider?.smtp?.username || "",
            password: apiSettings.email?.provider?.smtp?.password || "",
          },
        },
        notifications: {
          orderConfirmation:
            apiSettings.email?.notifications?.orderConfirmation ?? true,
          shippingConfirmation:
            apiSettings.email?.notifications?.shippingConfirmation ?? true,
          orderCanceled:
            apiSettings.email?.notifications?.orderCanceled ?? true,
          customerAccount:
            apiSettings.email?.notifications?.customerAccount ?? true,
          passwordReset:
            apiSettings.email?.notifications?.passwordReset ?? true,
          abandonedCart:
            apiSettings.email?.notifications?.abandonedCart ?? false,
        },
      },
      cms: {
        termsAndConditions: apiSettings.cms?.termsAndConditions || "",
        privacyPolicy: apiSettings.cms?.privacyPolicy || "",
        returnPolicy: apiSettings.cms?.returnPolicy || "",
        aboutUs: apiSettings.cms?.aboutUs || "",
        faq: apiSettings.cms?.faq || "",
      },
      advanced: {
        analytics: {
          googleAnalyticsId:
            apiSettings.advanced?.analytics?.googleAnalyticsId || "",
          facebookPixelId:
            apiSettings.advanced?.analytics?.facebookPixelId || "",
          enabled: apiSettings.advanced?.analytics?.enabled ?? false,
        },
        api: {
          apiKey: apiSettings.advanced?.api?.apiKey || "",
          webhookUrl: apiSettings.advanced?.api?.webhookUrl || "",
          webhooksEnabled: apiSettings.advanced?.api?.webhooksEnabled ?? false,
        },
        cloudinary: {
          cloudName: apiSettings.advanced?.cloudinary?.cloudName || "",
          apiKey: apiSettings.advanced?.cloudinary?.apiKey || "",
          apiSecret: apiSettings.advanced?.cloudinary?.apiSecret || "",
          uploadPreset: apiSettings.advanced?.cloudinary?.uploadPreset || "",
          secure: apiSettings.advanced?.cloudinary?.secure ?? true,
          folder: apiSettings.advanced?.cloudinary?.folder || "ecommerce",
        },
        performance: {
          pageCaching: apiSettings.advanced?.performance?.pageCaching ?? true,
          cacheDuration:
            apiSettings.advanced?.performance?.cacheDuration || 3600,
          imageOptimization:
            apiSettings.advanced?.performance?.imageOptimization ?? true,
          minifyAssets: apiSettings.advanced?.performance?.minifyAssets ?? true,
        },
        maintenance: {
          enabled: apiSettings.advanced?.maintenance?.enabled ?? false,
          message:
            apiSettings.advanced?.maintenance?.message ||
            "We're currently performing maintenance. Please check back later.",
          allowAdminAccess:
            apiSettings.advanced?.maintenance?.allowAdminAccess ?? true,
        },
      },
    };
  };

  // Watch form values for conditional rendering
  const watchedValues = watch();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFavicon(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCloudinarySecretVisibility = (field: "apiKey" | "apiSecret") => {
    setShowCloudinarySecrets((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: data }),
      });

      console.log("Settings Response", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      const result = await response.json();

      toast({
        title: "Settings saved",
        description:
          result.message || "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save individual section
  const saveSection = async (section: string, sectionData: any) => {
    try {
      const response = await fetch(`/api/settings/${section}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [section]: sectionData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to save ${section} settings`
        );
      }

      const result = await response.json();

      toast({
        title: "Settings saved",
        description:
          result.message || `${section} settings have been saved successfully.`,
      });

      return true;
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to save ${section} settings. Please try again.`,
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle save for current tab
  const handleSaveSection = async () => {
    const currentData = getValues();
    let sectionData: any;

    switch (activeTab) {
      case "general":
        sectionData = currentData.general;
        break;
      case "payment":
        sectionData = currentData.payment;
        break;
      case "shipping":
        sectionData = currentData.shipping;
        break;
      case "email":
        sectionData = currentData.email;
        break;
      case "cms":
        sectionData = currentData.cms;
        break;
      case "advanced":
        sectionData = currentData.advanced;
        break;
      default:
        return;
    }

    setIsSaving(true);
    await saveSection(activeTab, sectionData);
    setIsSaving(false);
  };

  // Helper function to handle boolean changes
  const handleBooleanChange = (path: string, value: boolean) => {
    setValue(path as any, value);
  };

  // Helper function to handle number changes
  const handleNumberChange = (path: string, value: string) => {
    setValue(path as any, value === "" ? 0 : parseFloat(value));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your store settings and configurations.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="cms">CMS</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>
                    Basic information about your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Store Name</Label>
                      <Input
                        id="store-name"
                        {...register("general.storeInfo.storeName")}
                      />
                      {errors.general?.storeInfo?.storeName && (
                        <p className="text-sm text-red-500">
                          {errors.general.storeInfo.storeName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Store Email</Label>
                      <Input
                        id="store-email"
                        type="email"
                        {...register("general.storeInfo.storeEmail")}
                      />
                      {errors.general?.storeInfo?.storeEmail && (
                        <p className="text-sm text-red-500">
                          {errors.general.storeInfo.storeEmail.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Store Phone</Label>
                      <Input
                        id="store-phone"
                        {...register("general.storeInfo.storePhone")}
                      />
                      {errors.general?.storeInfo?.storePhone && (
                        <p className="text-sm text-red-500">
                          {errors.general.storeInfo.storePhone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-address">Store Address</Label>
                      <Input
                        id="store-address"
                        {...register("general.storeInfo.storeAddress")}
                      />
                      {errors.general?.storeInfo?.storeAddress && (
                        <p className="text-sm text-red-500">
                          {errors.general.storeInfo.storeAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Branding</CardTitle>
                  <CardDescription>
                    Upload your store logo and favicon.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Store Logo</Label>
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                        {logo ? (
                          <div className="relative h-20 w-40 mb-4">
                            <Image
                              src={logo || "/placeholder.svg"}
                              alt="Store logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-20 w-40 mb-4 bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No logo</p>
                          </div>
                        )}
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommended size: 200x100px. Max file size: 1MB.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>Favicon</Label>
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                        {favicon ? (
                          <div className="relative h-10 w-10 mb-4">
                            <Image
                              src={favicon || "/placeholder.svg"}
                              alt="Favicon"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 mb-4 bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground text-xs">
                              No icon
                            </p>
                          </div>
                        )}
                        <Input
                          id="favicon"
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconChange}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommended size: 32x32px. Max file size: 100KB.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize your store for search engines.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      {...register("general.seo.metaTitle")}
                    />
                    {errors.general?.seo?.metaTitle && (
                      <p className="text-sm text-red-500">
                        {errors.general.seo.metaTitle.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      rows={3}
                      {...register("general.seo.metaDescription")}
                    />
                    {errors.general?.seo?.metaDescription && (
                      <p className="text-sm text-red-500">
                        {errors.general.seo.metaDescription.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-keywords">Meta Keywords</Label>
                    <Input
                      id="meta-keywords"
                      {...register("general.seo.metaKeywords")}
                    />
                    {errors.general?.seo?.metaKeywords && (
                      <p className="text-sm text-red-500">
                        {errors.general.seo.metaKeywords.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>
                    Connect your store to social media platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        {...register("general.socialMedia.facebook")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        {...register("general.socialMedia.instagram")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        {...register("general.socialMedia.twitter")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        {...register("general.socialMedia.youtube")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Settings */}
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Configure payment options for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-6 bg-[#3D95CE] rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <Label htmlFor="visa" className="font-medium">
                          Credit/Debit Cards
                        </Label>
                      </div>
                      <Switch
                        id="visa"
                        checked={
                          watchedValues.payment?.paymentMethods?.creditCards
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "payment.paymentMethods.creditCards",
                            value
                          )
                        }
                      />
                    </div>
                    {watchedValues.payment?.paymentMethods?.creditCards && (
                      <div className="pl-12 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="stripe-key">Stripe API Key</Label>
                          <Input
                            id="stripe-key"
                            type="password"
                            {...register(
                              "payment.paymentMethods.stripe.apiKey"
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stripe-secret">
                            Stripe Secret Key
                          </Label>
                          <Input
                            id="stripe-secret"
                            type="password"
                            {...register(
                              "payment.paymentMethods.stripe.secretKey"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-6 bg-[#0070BA] rounded flex items-center justify-center text-white text-xs font-bold">
                          PP
                        </div>
                        <Label htmlFor="paypal" className="font-medium">
                          PayPal
                        </Label>
                      </div>
                      <Switch
                        id="paypal"
                        checked={
                          watchedValues.payment?.paymentMethods?.paypal?.enabled
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "payment.paymentMethods.paypal.enabled",
                            value
                          )
                        }
                      />
                    </div>
                    {watchedValues.payment?.paymentMethods?.paypal?.enabled && (
                      <div className="pl-12 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="paypal-client">
                            PayPal Client ID
                          </Label>
                          <Input
                            id="paypal-client"
                            {...register(
                              "payment.paymentMethods.paypal.clientId"
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paypal-secret">PayPal Secret</Label>
                          <Input
                            id="paypal-secret"
                            type="password"
                            {...register(
                              "payment.paymentMethods.paypal.secret"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                        COD
                      </div>
                      <Label htmlFor="cod" className="font-medium">
                        Cash on Delivery
                      </Label>
                    </div>
                    <Switch
                      id="cod"
                      checked={
                        watchedValues.payment?.paymentMethods?.cashOnDelivery
                      }
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "payment.paymentMethods.cashOnDelivery",
                          value
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>
                    Configure currency options for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select
                        value={watchedValues.payment?.currency?.defaultCurrency}
                        onValueChange={(value: any) =>
                          setValue("payment.currency.defaultCurrency", value)
                        }
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - US Dollar</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="gbp">
                            GBP - British Pound
                          </SelectItem>
                          <SelectItem value="cad">
                            CAD - Canadian Dollar
                          </SelectItem>
                          <SelectItem value="aud">
                            AUD - Australian Dollar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency-format">Currency Format</Label>
                      <Select
                        value={watchedValues.payment?.currency?.currencyFormat}
                        onValueChange={(value: any) =>
                          setValue("payment.currency.currencyFormat", value)
                        }
                      >
                        <SelectTrigger id="currency-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="symbol">
                            Symbol ($10.99)
                          </SelectItem>
                          <SelectItem value="code">Code (USD 10.99)</SelectItem>
                          <SelectItem value="symbol-code">
                            Symbol and Code ($ 10.99 USD)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Settings</CardTitle>
                  <CardDescription>
                    Configure tax rates and settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="enable-tax" className="font-medium">
                        Enable Tax Calculation
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Apply taxes to product prices
                      </p>
                    </div>
                    <Switch
                      id="enable-tax"
                      checked={watchedValues.payment?.tax?.enabled}
                      onCheckedChange={(value) =>
                        handleBooleanChange("payment.tax.enabled", value)
                      }
                    />
                  </div>

                  {watchedValues.payment?.tax?.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                        <Input
                          id="tax-rate"
                          type="number"
                          {...register("payment.tax.taxRate", {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.payment?.tax?.taxRate && (
                          <p className="text-sm text-red-500">
                            {errors.payment.tax.taxRate.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <Label
                            htmlFor="prices-include-tax"
                            className="font-medium"
                          >
                            Prices Include Tax
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Product prices already include tax
                          </p>
                        </div>
                        <Switch
                          id="prices-include-tax"
                          checked={watchedValues.payment?.tax?.pricesIncludeTax}
                          onCheckedChange={(value) =>
                            handleBooleanChange(
                              "payment.tax.pricesIncludeTax",
                              value
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Settings */}
            <TabsContent value="shipping" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Methods</CardTitle>
                  <CardDescription>
                    Configure shipping options for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="free-shipping" className="font-medium">
                          Free Shipping
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Offer free shipping to customers
                        </p>
                      </div>
                      <Switch
                        id="free-shipping"
                        checked={
                          watchedValues.shipping?.methods?.freeShipping?.enabled
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "shipping.methods.freeShipping.enabled",
                            value
                          )
                        }
                      />
                    </div>
                    {watchedValues.shipping?.methods?.freeShipping?.enabled && (
                      <div className="pl-6 space-y-2">
                        <Label htmlFor="free-shipping-min">
                          Minimum Order Amount ($)
                        </Label>
                        <Input
                          id="free-shipping-min"
                          type="number"
                          {...register(
                            "shipping.methods.freeShipping.minimumAmount",
                            {
                              valueAsNumber: true,
                            }
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Orders above this amount qualify for free shipping
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="flat-rate" className="font-medium">
                          Flat Rate Shipping
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Charge a fixed rate for shipping
                        </p>
                      </div>
                      <Switch
                        id="flat-rate"
                        checked={
                          watchedValues.shipping?.methods?.flatRate?.enabled
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "shipping.methods.flatRate.enabled",
                            value
                          )
                        }
                      />
                    </div>
                    {watchedValues.shipping?.methods?.flatRate?.enabled && (
                      <div className="pl-6 space-y-2">
                        <Label htmlFor="flat-rate-cost">
                          Flat Rate Cost ($)
                        </Label>
                        <Input
                          id="flat-rate-cost"
                          type="number"
                          step="0.01"
                          {...register("shipping.methods.flatRate.cost", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label
                          htmlFor="express-shipping"
                          className="font-medium"
                        >
                          Express Shipping
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Offer expedited shipping option
                        </p>
                      </div>
                      <Switch
                        id="express-shipping"
                        checked={
                          watchedValues.shipping?.methods?.expressShipping
                            ?.enabled
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "shipping.methods.expressShipping.enabled",
                            value
                          )
                        }
                      />
                    </div>
                    {watchedValues.shipping?.methods?.expressShipping
                      ?.enabled && (
                      <div className="pl-6 space-y-2">
                        <Label htmlFor="express-cost">
                          Express Shipping Cost ($)
                        </Label>
                        <Input
                          id="express-cost"
                          type="number"
                          step="0.01"
                          {...register(
                            "shipping.methods.expressShipping.cost",
                            {
                              valueAsNumber: true,
                            }
                          )}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Options</CardTitle>
                  <CardDescription>
                    Additional shipping settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label
                        htmlFor="shipping-calculator"
                        className="font-medium"
                      >
                        Enable Shipping Calculator
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to calculate shipping costs before
                        checkout
                      </p>
                    </div>
                    <Switch
                      id="shipping-calculator"
                      checked={
                        watchedValues.shipping?.options?.shippingCalculator
                      }
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "shipping.options.shippingCalculator",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label
                        htmlFor="international-shipping"
                        className="font-medium"
                      >
                        International Shipping
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable shipping to international destinations
                      </p>
                    </div>
                    <Switch
                      id="international-shipping"
                      checked={
                        watchedValues.shipping?.options?.internationalShipping
                      }
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "shipping.options.internationalShipping",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping-origin">
                      Shipping Origin Address
                    </Label>
                    <Textarea
                      id="shipping-origin"
                      rows={3}
                      {...register("shipping.options.shippingOrigin")}
                    />
                    {errors.shipping?.options?.shippingOrigin && (
                      <p className="text-sm text-red-500">
                        {errors.shipping.options.shippingOrigin.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Provider</CardTitle>
                  <CardDescription>
                    Configure your email service provider.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Email Service</Label>
                    <Select
                      value={watchedValues.email?.provider?.service}
                      onValueChange={(value: any) =>
                        setValue("email.provider.service", value)
                      }
                    >
                      <SelectTrigger id="email-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        <SelectItem value="aws-ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {watchedValues.email?.provider?.service === "smtp" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input
                          id="smtp-host"
                          {...register("email.provider.smtp.host")}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-port">SMTP Port</Label>
                          <Input
                            id="smtp-port"
                            type="number"
                            {...register("email.provider.smtp.port", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-security">Security</Label>
                          <Select
                            value={
                              watchedValues.email?.provider?.smtp?.security
                            }
                            onValueChange={(value: any) =>
                              setValue("email.provider.smtp.security", value)
                            }
                          >
                            <SelectTrigger id="smtp-security">
                              <SelectValue placeholder="Select security" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="ssl">SSL</SelectItem>
                              <SelectItem value="tls">TLS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtp-username">SMTP Username</Label>
                        <Input
                          id="smtp-username"
                          {...register("email.provider.smtp.username")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">SMTP Password</Label>
                        <Input
                          id="smtp-password"
                          type="password"
                          {...register("email.provider.smtp.password")}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="test-email" className="font-medium">
                        Test Email Configuration
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send a test email to verify settings
                      </p>
                    </div>
                    <Button variant="outline">Send Test Email</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Configure automated email notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label
                          htmlFor="order-confirmation"
                          className="font-medium"
                        >
                          Order Confirmation
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is placed
                        </p>
                      </div>
                      <Switch
                        id="order-confirmation"
                        checked={
                          watchedValues.email?.notifications?.orderConfirmation
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "email.notifications.orderConfirmation",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label
                          htmlFor="shipping-confirmation"
                          className="font-medium"
                        >
                          Shipping Confirmation
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send email when an order ships
                        </p>
                      </div>
                      <Switch
                        id="shipping-confirmation"
                        checked={
                          watchedValues.email?.notifications
                            ?.shippingConfirmation
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "email.notifications.shippingConfirmation",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="order-canceled" className="font-medium">
                          Order Canceled
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is canceled
                        </p>
                      </div>
                      <Switch
                        id="order-canceled"
                        checked={
                          watchedValues.email?.notifications?.orderCanceled
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "email.notifications.orderCanceled",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label
                          htmlFor="customer-account"
                          className="font-medium"
                        >
                          Customer Account
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send email when a customer creates an account
                        </p>
                      </div>
                      <Switch
                        id="customer-account"
                        checked={
                          watchedValues.email?.notifications?.customerAccount
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "email.notifications.customerAccount",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="password-reset" className="font-medium">
                          Password Reset
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send email for password reset requests
                        </p>
                      </div>
                      <Switch
                        id="password-reset"
                        checked={
                          watchedValues.email?.notifications?.passwordReset
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "email.notifications.passwordReset",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="abandoned-cart" className="font-medium">
                          Abandoned Cart
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send reminder emails for abandoned carts
                        </p>
                      </div>
                      <Switch
                        id="abandoned-cart"
                        checked={
                          watchedValues.email?.notifications?.abandonedCart
                        }
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "email.notifications.abandonedCart",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CMS Settings */}
            <TabsContent value="cms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Pages</CardTitle>
                  <CardDescription>
                    Manage your store's legal content.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="terms-conditions">
                      Terms and Conditions
                    </Label>
                    <RichTextEditor
                      value={watchedValues.cms?.termsAndConditions || ""}
                      onChange={(value) =>
                        setValue("cms.termsAndConditions", value)
                      }
                    />
                    {errors.cms?.termsAndConditions && (
                      <p className="text-sm text-red-500">
                        {errors.cms.termsAndConditions.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <CardDescription>
                    Manage your store's privacy policy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="privacy-policy">
                      Privacy Policy Content
                    </Label>
                    <RichTextEditor
                      value={watchedValues.cms?.privacyPolicy || ""}
                      onChange={(value) => setValue("cms.privacyPolicy", value)}
                    />
                    {errors.cms?.privacyPolicy && (
                      <p className="text-sm text-red-500">
                        {errors.cms.privacyPolicy.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Return Policy</CardTitle>
                  <CardDescription>
                    Manage your store's return policy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="return-policy">Return Policy Content</Label>
                    <RichTextEditor
                      value={watchedValues.cms?.returnPolicy || ""}
                      onChange={(value) => setValue("cms.returnPolicy", value)}
                    />
                    {errors.cms?.returnPolicy && (
                      <p className="text-sm text-red-500">
                        {errors.cms.returnPolicy.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About Us</CardTitle>
                  <CardDescription>
                    Manage your store's about page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="about-us">About Us Content</Label>
                    <RichTextEditor
                      value={watchedValues.cms?.aboutUs || ""}
                      onChange={(value) => setValue("cms.aboutUs", value)}
                    />
                    {errors.cms?.aboutUs && (
                      <p className="text-sm text-red-500">
                        {errors.cms.aboutUs.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                  <CardDescription>
                    Manage your store's frequently asked questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="faq">FAQ Content</Label>
                    <RichTextEditor
                      value={watchedValues.cms?.faq || ""}
                      onChange={(value) => setValue("cms.faq", value)}
                    />
                    {errors.cms?.faq && (
                      <p className="text-sm text-red-500">
                        {errors.cms.faq.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-4">
              {/* Analytics Card - Remains the same */}
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Configure analytics tracking for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="google-analytics">
                      Google Analytics ID
                    </Label>
                    <Input
                      id="google-analytics"
                      {...register("advanced.analytics.googleAnalyticsId")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                    <Input
                      id="facebook-pixel"
                      {...register("advanced.analytics.facebookPixelId")}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="enable-analytics" className="font-medium">
                        Enable Analytics
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Track visitor and conversion data
                      </p>
                    </div>
                    <Switch
                      id="enable-analytics"
                      checked={watchedValues.advanced?.analytics?.enabled}
                      onCheckedChange={(value) =>
                        handleBooleanChange("advanced.analytics.enabled", value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cloudinary Card - NEW */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Cloudinary Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your Cloudinary account for image storage and
                    optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cloudinary-cloud-name">Cloud Name</Label>
                      <Input
                        id="cloudinary-cloud-name"
                        {...register("advanced.cloudinary.cloudName")}
                        placeholder="your-cloud-name"
                      />
                      {errors.advanced?.cloudinary?.cloudName && (
                        <p className="text-sm text-red-500">
                          {errors.advanced.cloudinary.cloudName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cloudinary-folder">Default Folder</Label>
                      <Input
                        id="cloudinary-folder"
                        {...register("advanced.cloudinary.folder")}
                        placeholder="ecommerce"
                      />
                      {errors.advanced?.cloudinary?.folder && (
                        <p className="text-sm text-red-500">
                          {errors.advanced.cloudinary.folder.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cloudinary-api-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="cloudinary-api-key"
                        type={
                          showCloudinarySecrets.apiKey ? "text" : "password"
                        }
                        {...register("advanced.cloudinary.apiKey")}
                        placeholder="Your Cloudinary API Key"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          toggleCloudinarySecretVisibility("apiKey")
                        }
                      >
                        {showCloudinarySecrets.apiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.advanced?.cloudinary?.apiKey && (
                      <p className="text-sm text-red-500">
                        {errors.advanced.cloudinary.apiKey.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cloudinary-api-secret">API Secret</Label>
                    <div className="relative">
                      <Input
                        id="cloudinary-api-secret"
                        type={
                          showCloudinarySecrets.apiSecret ? "text" : "password"
                        }
                        {...register("advanced.cloudinary.apiSecret")}
                        placeholder="Your Cloudinary API Secret"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          toggleCloudinarySecretVisibility("apiSecret")
                        }
                      >
                        {showCloudinarySecrets.apiSecret ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.advanced?.cloudinary?.apiSecret && (
                      <p className="text-sm text-red-500">
                        {errors.advanced.cloudinary.apiSecret.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cloudinary-upload-preset">
                        Upload Preset
                      </Label>
                      <Input
                        id="cloudinary-upload-preset"
                        {...register("advanced.cloudinary.uploadPreset")}
                        placeholder="Optional upload preset"
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2 pt-6">
                      <div>
                        <Label
                          htmlFor="cloudinary-secure"
                          className="font-medium"
                        >
                          Secure URLs
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Use HTTPS for image delivery
                        </p>
                      </div>
                      <Switch
                        id="cloudinary-secure"
                        checked={watchedValues.advanced?.cloudinary?.secure}
                        onCheckedChange={(value) =>
                          handleBooleanChange(
                            "advanced.cloudinary.secure",
                            value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-2">
                      Cloudinary Setup Instructions:
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>
                        1. Sign up for a Cloudinary account at cloudinary.com
                      </li>
                      <li>
                        2. Find your credentials in the Cloudinary Dashboard
                      </li>
                      <li>
                        3. Enter your Cloud Name, API Key, and API Secret above
                      </li>
                      <li>
                        4. Set up upload presets in your Cloudinary dashboard if
                        needed
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* API Card - Remains the same */}
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>
                    Configure API settings for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      {...register("advanced.api.apiKey")}
                    />
                    {errors.advanced?.api?.apiKey && (
                      <p className="text-sm text-red-500">
                        {errors.advanced.api.apiKey.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      {...register("advanced.api.webhookUrl")}
                      placeholder="https://example.com/webhook"
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="webhooks-enabled" className="font-medium">
                        Enable Webhooks
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send webhook notifications for store events
                      </p>
                    </div>
                    <Switch
                      id="webhooks-enabled"
                      checked={watchedValues.advanced?.api?.webhooksEnabled}
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "advanced.api.webhooksEnabled",
                          value
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cache & Performance Card - Remains the same */}
              <Card>
                <CardHeader>
                  <CardTitle>Cache & Performance</CardTitle>
                  <CardDescription>
                    Configure caching and performance settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="enable-cache" className="font-medium">
                        Enable Page Caching
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Cache pages to improve loading speed
                      </p>
                    </div>
                    <Switch
                      id="enable-cache"
                      checked={watchedValues.advanced?.performance?.pageCaching}
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "advanced.performance.pageCaching",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cache-duration">
                      Cache Duration (minutes)
                    </Label>
                    <Input
                      id="cache-duration"
                      type="number"
                      {...register("advanced.performance.cacheDuration", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label
                        htmlFor="image-optimization"
                        className="font-medium"
                      >
                        Image Optimization
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically optimize uploaded images
                      </p>
                    </div>
                    <Switch
                      id="image-optimization"
                      checked={
                        watchedValues.advanced?.performance?.imageOptimization
                      }
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "advanced.performance.imageOptimization",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="minify-assets" className="font-medium">
                        Minify CSS/JS
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Minify CSS and JavaScript files
                      </p>
                    </div>
                    <Switch
                      id="minify-assets"
                      checked={
                        watchedValues.advanced?.performance?.minifyAssets
                      }
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "advanced.performance.minifyAssets",
                          value
                        )
                      }
                    />
                  </div>

                  <Button variant="outline">Clear Cache</Button>
                </CardContent>
              </Card>

              {/* Maintenance Mode Card - Remains the same */}
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription>
                    Configure maintenance mode settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="maintenance-mode" className="font-medium">
                        Enable Maintenance Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable your store for maintenance
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={watchedValues.advanced?.maintenance?.enabled}
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "advanced.maintenance.enabled",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenance-message">
                      Maintenance Message
                    </Label>
                    <Textarea
                      id="maintenance-message"
                      rows={3}
                      {...register("advanced.maintenance.message")}
                    />
                    {errors.advanced?.maintenance?.message && (
                      <p className="text-sm text-red-500">
                        {typeof errors.advanced?.maintenance?.message ===
                          "object" &&
                          errors.advanced.maintenance.message.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="admin-access" className="font-medium">
                        Allow Admin Access
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow administrators to access the site during
                        maintenance
                      </p>
                    </div>
                    <Switch
                      id="admin-access"
                      checked={
                        watchedValues.advanced?.maintenance?.allowAdminAccess
                      }
                      onCheckedChange={(value) =>
                        handleBooleanChange(
                          "advanced.maintenance.allowAdminAccess",
                          value
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || isSubmitting}>
              {isSaving || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
}
