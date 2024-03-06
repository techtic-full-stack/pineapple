import * as admin from "firebase-admin";
import {logger} from "firebase-functions/v2";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {CustomerData} from "../interfaces";
import stripe from "../Stripe/stripe";

/**
 * Create a new customer object in Stripe.
 */
const createCustomerRecord = async ({
  email,
  uid,
  phone,
}: {
  email?: string;
  phone?: string;
  uid: string;
}) => {
  try {
    logger.log(`⚙️ Creating customer object for [${uid}].`);
    const customerData: CustomerData = {
      metadata: {
        firebaseUID: uid,
      },
    };
    if (email) customerData.email = email;
    if (phone) customerData.phone = phone;
    // Create the customer object in Stripe
    const customer = await stripe.customers.create(customerData);
    // Add a mapping record in Cloud Firestore.
    const customerRecord = {
      email: customer.email,
      stripeId: customer.id,
      stripeLink: `https://dashboard.stripe.com${
        customer.livemode ? "" : "/test"
      }/customers/${customer.id}`,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (phone) (customerRecord as any).phone = phone;
    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .set(customerRecord, {merge: true});
    logger.log(
      `✅Created a new customer: https://dashboard.stripe.com${
        customer.livemode ? "" : "/test"
      }/customers/${customer.id}.`
    );
    return customerRecord;
  } catch (error) {
    logger.error(`❌ Error creating customer: ${error}`);
    return null;
  }
};

/**
 * On user creation, create a Stripe customer object.
 */
const CreateStripeCustomer = onDocumentCreated({
  document: "users/{userId}",
  region: "europe-west1",
}, (event) => {
  const user = event.data?.data();

  if (!user) {
    logger.error("No data associated with the event");
    return;
  }

  return createCustomerRecord({
    email: user.email,
    phone: user.phoneNumber,
    uid: user.id,
  });
});

export default CreateStripeCustomer;
