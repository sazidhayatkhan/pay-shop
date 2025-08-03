"use client";

import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import convertToSubcurrency from "../lib/convertToSubcurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const {error} = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams:{
            return_url:`http://www.localhost:3000/payment-success?amount=${amount}`,
        }
    })

    if(error){
        setErrorMessage(error.message)
    }else{

    }
  };

  if(!clientSecret || !stripe || !elements){
    return(
        <div>loading.....</div>
    )
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md p-2">
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}
      <button 
        disabled={!stripe || loading}
        className="w-full mt-3 text-center p-5 bg-black text-white text-sm font-bold rounded-md disabled:opacity-50 disabled::animate-pulse">
            {!loading ? `Pay the ${amount}`:"Processing....."}
        </button>
    </form>
  );
};

export default CheckoutPage;
