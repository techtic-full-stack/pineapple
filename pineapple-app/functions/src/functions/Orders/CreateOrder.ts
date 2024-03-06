import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import {firestore} from "firebase-admin";
import {logger} from "firebase-functions/v1";

interface CheckoutSession {
  status: string;
  shopId: string;
  totalAmount: number;
  cartItems: any[];
  // ---- Not used in this function ----
  createdAt: string;
  customer: string;
  ephemeralKey: string;
  partyId: string | null;
  paymentIntent: string;
  publishableKey: string;
  userStripeId: string;
  shopStripeConnectId: string;
}

/**
 * Create an order when a checkout session is paid
 */
const CreateOrder = onDocumentUpdated({
  document: "users/{userId}/checkoutSessions/{sessionId}",
  region: "europe-west1",
}, async (event) => {
  const afterData = event.data?.after.data() as CheckoutSession | undefined; // Type assertion

  if (!afterData) {
    logger.error("No checkout session data found");
    return;
  }

  const {status, shopId, totalAmount, cartItems} = afterData;

  if (status === "paid") {
    logger.info("🛍 Creating order");
    // Ensure all needed data is present
    if (!shopId || !totalAmount || !cartItems) {
      logger.error("Missing data for order creation");
      return;
    }
    const db = firestore();
    const orderRef = db.collection("orders").doc();
    const userId = event.params.userId;

    await orderRef.set({
      userId,
      shopId,
      totalAmount,
      cartItems,
    });

    logger.info("🛍 Order created");
  }
});

export default CreateOrder;
