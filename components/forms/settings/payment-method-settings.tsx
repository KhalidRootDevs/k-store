import { SettingsFormData } from "@/app/(admin)/admin/settings/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useFormContext } from "react-hook-form";

export default function PaymentMethod({
  handleBooleanChange,
}: {
  handleBooleanChange: (path: string, value: boolean) => void;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SettingsFormData>();
  const watchedValues = watch();

  return (
    <div className="space-y-4">
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
                checked={watchedValues.payment?.paymentMethods?.creditCards}
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
                    {...register("payment.paymentMethods.stripe.apiKey")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                  <Input
                    id="stripe-secret"
                    type="password"
                    {...register("payment.paymentMethods.stripe.secretKey")}
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
                checked={watchedValues.payment?.paymentMethods?.paypal?.enabled}
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
                  <Label htmlFor="paypal-client">PayPal Client ID</Label>
                  <Input
                    id="paypal-client"
                    {...register("payment.paymentMethods.paypal.clientId")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypal-secret">PayPal Secret</Label>
                  <Input
                    id="paypal-secret"
                    type="password"
                    {...register("payment.paymentMethods.paypal.secret")}
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
              checked={watchedValues.payment?.paymentMethods?.cashOnDelivery}
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
                  <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
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
                  <SelectItem value="symbol">Symbol ($10.99)</SelectItem>
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
          <CardDescription>Configure tax rates and settings.</CardDescription>
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
                  <Label htmlFor="prices-include-tax" className="font-medium">
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
                    handleBooleanChange("payment.tax.pricesIncludeTax", value)
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
