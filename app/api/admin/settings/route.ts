import { NextRequest, NextResponse } from "next/server";
import { Settings } from "@/models/Settings";
import connectDB from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get or create settings
    const settings = await Settings.getSettings();

    // Remove sensitive data before sending
    const safeSettings = JSON.parse(JSON.stringify(settings));

    if (safeSettings.payment?.paymentMethods?.stripe) {
      safeSettings.payment.paymentMethods.stripe.secretKey = "[HIDDEN]";
    }

    if (safeSettings.payment?.paymentMethods?.paypal) {
      safeSettings.payment.paymentMethods.paypal.secret = "[HIDDEN]";
    }

    if (safeSettings.email?.provider?.smtp) {
      safeSettings.email.provider.smtp.password = "[HIDDEN]";
    }

    if (safeSettings.advanced?.api) {
      safeSettings.advanced.api.apiKey = "[HIDDEN]";
    }

    return NextResponse.json({ settings: safeSettings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { settings: updatedSettings } = body;

    if (!updatedSettings) {
      return NextResponse.json(
        { error: "Settings data is required" },
        { status: 400 }
      );
    }

    // Get existing settings to preserve sensitive fields
    const existingSettings = await Settings.getSettings();
    const existingSettingsObj = existingSettings.toObject();

    // Merge settings, preserving sensitive fields that shouldn't be updated if empty
    const mergedSettings = deepMergeSettings(
      existingSettingsObj,
      updatedSettings
    );

    // Update settings
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: mergedSettings },
      { new: true, upsert: true, runValidators: true }
    );

    // Remove sensitive data from response
    const safeSettings = JSON.parse(JSON.stringify(settings));

    if (safeSettings.payment?.paymentMethods?.stripe) {
      safeSettings.payment.paymentMethods.stripe.secretKey = updatedSettings
        .payment?.paymentMethods?.stripe?.secretKey
        ? "[UPDATED]"
        : "[HIDDEN]";
    }

    if (safeSettings.payment?.paymentMethods?.paypal) {
      safeSettings.payment.paymentMethods.paypal.secret = updatedSettings
        .payment?.paymentMethods?.paypal?.secret
        ? "[UPDATED]"
        : "[HIDDEN]";
    }

    if (safeSettings.email?.provider?.smtp) {
      safeSettings.email.provider.smtp.password = updatedSettings.email
        ?.provider?.smtp?.password
        ? "[UPDATED]"
        : "[HIDDEN]";
    }

    if (safeSettings.advanced?.api) {
      safeSettings.advanced.api.apiKey = updatedSettings.advanced?.api?.apiKey
        ? "[UPDATED]"
        : "[HIDDEN]";
    }

    return NextResponse.json({
      settings: safeSettings,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Update settings error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to deeply merge settings while preserving sensitive data
function deepMergeSettings(existing: any, updated: any): any {
  const result = JSON.parse(JSON.stringify(existing));

  for (const key in updated) {
    if (
      updated[key] &&
      typeof updated[key] === "object" &&
      !Array.isArray(updated[key])
    ) {
      // Handle sensitive fields specially
      if (key === "payment" && updated.payment?.paymentMethods) {
        if (updated.payment.paymentMethods.stripe) {
          // Only update stripe secret key if provided
          if (
            updated.payment.paymentMethods.stripe.secretKey &&
            updated.payment.paymentMethods.stripe.secretKey !== "[HIDDEN]"
          ) {
            result.payment.paymentMethods.stripe.secretKey =
              updated.payment.paymentMethods.stripe.secretKey;
          }
          if (updated.payment.paymentMethods.stripe.apiKey) {
            result.payment.paymentMethods.stripe.apiKey =
              updated.payment.paymentMethods.stripe.apiKey;
          }
        }

        if (updated.payment.paymentMethods.paypal) {
          // Only update paypal secret if provided
          if (
            updated.payment.paymentMethods.paypal.secret &&
            updated.payment.paymentMethods.paypal.secret !== "[HIDDEN]"
          ) {
            result.payment.paymentMethods.paypal.secret =
              updated.payment.paymentMethods.paypal.secret;
          }
          if (updated.payment.paymentMethods.paypal.clientId) {
            result.payment.paymentMethods.paypal.clientId =
              updated.payment.paymentMethods.paypal.clientId;
          }
          result.payment.paymentMethods.paypal.enabled =
            updated.payment.paymentMethods.paypal.enabled;
        }

        result.payment.paymentMethods.creditCards =
          updated.payment.paymentMethods.creditCards;
        result.payment.paymentMethods.cashOnDelivery =
          updated.payment.paymentMethods.cashOnDelivery;
      } else if (key === "email" && updated.email?.provider?.smtp) {
        // Only update SMTP password if provided
        if (
          updated.email.provider.smtp.password &&
          updated.email.provider.smtp.password !== "[HIDDEN]"
        ) {
          result.email.provider.smtp.password =
            updated.email.provider.smtp.password;
        }
        result.email.provider.smtp.host = updated.email.provider.smtp.host;
        result.email.provider.smtp.port = updated.email.provider.smtp.port;
        result.email.provider.smtp.security =
          updated.email.provider.smtp.security;
        result.email.provider.smtp.username =
          updated.email.provider.smtp.username;
        result.email.provider.service = updated.email.provider.service;
      } else if (key === "advanced" && updated.advanced?.api) {
        // Only update API key if provided
        if (
          updated.advanced.api.apiKey &&
          updated.advanced.api.apiKey !== "[HIDDEN]"
        ) {
          result.advanced.api.apiKey = updated.advanced.api.apiKey;
        }
        result.advanced.api.webhookUrl = updated.advanced.api.webhookUrl;
        result.advanced.api.webhooksEnabled =
          updated.advanced.api.webhooksEnabled;
      } else {
        // Recursively merge other objects
        result[key] = deepMergeSettings(result[key] || {}, updated[key]);
      }
    } else {
      // Update primitive values
      result[key] = updated[key];
    }
  }

  return result;
}
