// app/api/verify/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";

const generatedSignature = (razorpayOrderId, razorpayPaymentId) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request) {
  const { orderCreationId, razorpayPaymentId, razorpaySignature } =
    await request.json();

  const signature = generatedSignature(orderCreationId, razorpayPaymentId);

  if (signature !== razorpaySignature) {
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Payment verified successfully.",
    },
    { status: 200 }
  );
}
