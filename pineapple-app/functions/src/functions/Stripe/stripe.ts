// import {defineString} from "firebase-functions/params";
import Stripe from "stripe";

// const stripeSecret = defineString("STRIPE_API_KEY").value();
// eslint-disable-next-line max-len
const stripeSecret = "sk_test_51NttmUHBEwXjGJ7beEas5jSMi7GrteieHY4WtiGybPzL52S8JcjQ26hZrjoGrvet6IU2IB81i8ISuZYz4xRuWqAM00qsdSD7br";
/**
 * Use `stripeTest` when testing
 */
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-10-16",
});

export default stripe;

// export const stripeTestSecret = defineString("STRIPE_TEST_SECRET").value();

// /** Points to Stripe Test Environment */
// export const stripeTest = new Stripe(stripeTestSecret, {
//   apiVersion: "2023-10-16",
// });
