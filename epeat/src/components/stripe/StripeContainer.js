import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const PUBLIC_KEY =
  "pk_test_51MU72cBAbxORSEclu5Vm51Jr9nhJJScD7kVNmv2fWAoL1V4GXZRyoLjtbuZCBs17mhD6e5hBMWDm5aNZnWMDx9Aj00kYk3xTjt";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Stripe;
