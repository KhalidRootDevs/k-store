// Mock function to simulate getting settings from admin panel
// In a real app, this would fetch from your database
export async function getAdminSettings() {
  // This would typically be a database call
  // For demo purposes, we'll return mock settings
  return {
    payment: {
      stripe: {
        publishableKey: "",
        secretKey: "",
        enabled: true,
      },
      paypal: {
        clientId: "your_paypal_client_id",
        enabled: false,
      },
    },
    store: {
      name: "K-Store",
      currency: "USD",
      taxRate: 0.08,
      shippingRate: 9.99,
      freeShippingThreshold: 50,
    },
  };
}

// Get Stripe configuration from admin settings
export async function getStripeConfig() {
  try {
    const settings = await getAdminSettings();
    return {
      publishableKey: settings.payment.stripe.publishableKey,
      secretKey: settings.payment.stripe.secretKey,
      enabled: settings.payment.stripe.enabled,
    };
  } catch (error) {
    console.error("Failed to get Stripe configuration:", error);
    return {
      publishableKey: null,
      secretKey: null,
      enabled: false,
    };
  }
}
