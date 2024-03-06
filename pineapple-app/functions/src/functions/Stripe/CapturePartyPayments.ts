import {onRequest} from "firebase-functions/v2/https";
import stripe from "./stripe";
import {firestore} from "firebase-admin";
import {logger} from "firebase-functions/v1";

const CapturePartyPayments = onRequest(async (req, res) => {
  try {
    logger.info("⚙️ Capturing party payments");
    const {partyId} = req.body;
    // Get discountRate from party document
    const partyRef = firestore().collection("parties").doc(partyId);
    const partyDoc = await partyRef.get();
    if (!partyDoc.exists) {
      res.status(404).send("Party not found");
      return;
    }
    const partyData = partyDoc.data();
    if (!partyData) {
      res.status(500).send("Internal Server Error");
      return;
    }
    const discountRate = partyData.discountRate;

    // Go through all party members and capture their payments
    const partyMembersRef = partyRef.collection("members");
    const partyMembers = await partyMembersRef.get();
    // In all members, we need to capture the payment minus the discount
    const capturePromises = partyMembers.docs.map(async (memberDoc) => {
      const memberData = memberDoc.data();
      // Get only the paymentIntentId from the paymentIntent
      const paymentIntentId = memberData.paymentIntent.split("_secret_")[0];
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const amountToCapture = paymentIntent.amount * (1 - discountRate);
      return stripe.paymentIntents.capture(paymentIntentId, {
        amount_to_capture: amountToCapture,
      });
    });
    await Promise.all(capturePromises);
    logger.info("✅ Captured party payments");
    res.status(200).send("OK");
    return;
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
});

export default CapturePartyPayments;
