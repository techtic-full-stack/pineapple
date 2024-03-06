import {logger} from "firebase-functions/v1";
import stripe from "./stripe";
import {APPLICATION_FEE_AMOUNT, STRIPE_API_VERSION, STRIPE_PUBLISHABLE_KEY} from "../../utils/constants";
import {onDocumentCreated} from "firebase-functions/v2/firestore";

/**
 * Create a payment intent when a checkout session is created
 */
const CreatePaymentIntent = onDocumentCreated({
  document: "users/{userId}/checkoutSessions/{sessionId}",
  region: "europe-west1",
}, async (event) => {
  try {
    logger.info("⚙️ Creating payment intent");

    const snapshot = event.data;
    const checkoutSession = event.data?.data();

    if (!snapshot || !checkoutSession) {
      logger.error("No checkout session data found");
      return;
    }

    const {totalAmount, userStripeId, shopStripeConnectId, partyId} = checkoutSession;

    if (!totalAmount ) {
      logger.error("Missing required checkout session data, totalAmount");
      return;
    }

    if (!userStripeId) {
      logger.error("Missing required checkout session data, userStripeId");
      return;
    }

    if (!shopStripeConnectId) {
      logger.error("Missing required checkout session data, shopStripeConnectId");
      return;
    }

    const customer = await stripe.customers.retrieve(userStripeId);

    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: STRIPE_API_VERSION}
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to smallest currency unit
      currency: "nok",
      customer: customer.id,
      metadata: {
        firebase_checkout_session_id: event.params.sessionId,
      },
      application_fee_amount: APPLICATION_FEE_AMOUNT,
      transfer_data: {
        destination: shopStripeConnectId,
      },
    });

    if (partyId && partyId !== "null") {
      logger.info("🎉 Party mode detected, starting party initiation");
      await stripe.paymentIntents.update(paymentIntent.id, {
        capture_method: "manual", // Hold the payment
        metadata: {
          partyId,
        },
      });
    }

    logger.info("🔥 Payment intent created:", paymentIntent.id);
    return snapshot.ref.update({
      status: "payment_intent_created",
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    logger.error("Error creating payment sheet:", error);
    return;
  }
});

export default CreatePaymentIntent;
