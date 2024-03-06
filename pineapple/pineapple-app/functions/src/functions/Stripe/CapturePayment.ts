import {onRequest} from "firebase-functions/v2/https";
import stripe from "./stripe";

/**
 * Capture a payment intent
 */
const CapturePayment = onRequest(async (req, res) => {
  try {
    const {paymentIntentId} = req.body;
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    res.json({success: true, paymentIntent});
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).send("Internal Server Error");
  }
}
);

export default CapturePayment;
