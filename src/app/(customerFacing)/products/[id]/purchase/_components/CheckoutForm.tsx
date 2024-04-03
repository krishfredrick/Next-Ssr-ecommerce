"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import React, { FormEvent, useState } from "react";

type CheckoutFormProps = {
  product: {
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
  clientSecret: string;
};
const stripePromise = loadStripe(process.env.NEXT_STRIPE_PUBLIC_KEY as string);

export default function CheckoutForm({
  product,
  clientSecret,
}: CheckoutFormProps) {
  return (
    <>
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <div className="flex gap-4 items-center">
          <div className="aspect-video flex-shrink-0 w-1/3 relative">
            <Image
              src={product.imagePath}
              fill
              alt={product.name}
              className="object-cover"
            />
          </div>
          <div className="">
            <div className="text-lg">
              {formatCurrency(product.priceInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold ">{product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground"></div>
          </div>
        </div>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <Form priceInCents={product.priceInCents} />
        </Elements>
      </div>
    </>
  );
}

function Form({ priceInCents }: { priceInCents: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e: FormEvent){
    e.preventDefault()
    if(stripe == null || elements == null) return;
    setIsLoading(true)

    // Check for existing order

    stripe.confirmPayment({elements, confirmParams: {
      return_url: `${process.env.NEXT_STRIPE_PUBLIC_KEY}`
    }})
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive"> Error</CardDescription>
        </CardHeader>
        <PaymentElement />
        <CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={stripe == null || elements == null || isLoading}
            >
              {isLoading ? "Purchasing...": `Purchase -${formatCurrency(priceInCents / 100)}`}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </form>
  );
}
