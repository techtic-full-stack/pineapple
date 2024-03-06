/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2/options";
import { onRequest } from "firebase-functions/v2/https";
import AddUserToFirestore from "./functions/User/AddUserToFirestore";
import GetUserToFirestore from "./functions/User/GetUserToFirestore";
import GeneratePartyCode from "./functions/PartyMode/GeneratePartyCode";
import CapturePayment from "./functions/Stripe/CapturePayment";
import CreateStripeCustomer from "./functions/User/CreateStripeCustomer";
import CreatePaymentIntent from "./functions/Stripe/CreatePaymentIntent";
import CreateOrder from "./functions/Orders/CreateOrder";
import UpdatePartyDiscount from "./functions/PartyMode/UpdatePartyDiscount";
import CapturePartyPayments from "./functions/Stripe/CapturePartyPayments";
// import onCallAuth from "./functions/topLevelHelper";

setGlobalOptions({ region: "europe-west1" });

admin.initializeApp();

// User functions
export const addUserToFirestore = AddUserToFirestore;
export const getUserToFIrestore = GetUserToFirestore;

export const createStripeCustomer = CreateStripeCustomer;

// Order functions
export const createOrder = CreateOrder;

// PartyMode functions
export const generatePartyCode = GeneratePartyCode;
export const updatePartyDiscount = UpdatePartyDiscount;

// Stripe functions
export const createPaymentIntent = CreatePaymentIntent;

export const capturePartyPayments = onRequest(CapturePartyPayments);

export const capturePayment = onRequest(CapturePayment);
