'use client'
import React from 'react'
import convertToSubcurrency from '../../lib/convertToSubcurrency'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutPage from '../../components/CheckoutPage'

if(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined){
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const page = () => {
  const amount = 49.99
  return (
    <div className='bg-green-300 mx-auto w-[700px] p-5 mt-5'>
      <div className='text-center'>
        <h1>Sny</h1>
        <h2>has requested ${amount}</h2>
      </div>
      <Elements 
        stripe={stripePromise}
        options={{
          mode:"payment",
          amount:convertToSubcurrency(amount),
          currency:"usd"

        }}
      >
        <CheckoutPage amount={amount}/>
      </Elements>
    </div>
  )
}

export default page