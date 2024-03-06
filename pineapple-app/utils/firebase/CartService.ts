import firestore from '@react-native-firebase/firestore'
import { TCartItem } from '../types'

interface SessionData {
	userId: string
	userStripeId: string
	shopId: string
	shopStripeConnectId: string
	cartItems: TCartItem[]
	totalAmount: number
	status: 'pending' | 'payment_intent_created' | 'paid' | 'failed'
	createdAt: string
	partyId?: string | null
	// Created after the session and the paymentIntent are created
	paymentIntent?: string
	ephemeralKey?: string
	customer?: string
	publishableKey?: string
}

/**
 * Creates a new checkout session and adds it to the Firestore database.
 *
 * @param {string} userId - Id of the user.
 * @param {string} shopId - Id of the shop.
 * @param {TCartItem[]} cartItems - An array of cart items.
 * @param {number} totalAmount - The total amount for the checkout session.
 * @param {string} [partyId] - An optional party Id.
 * @returns {Promise<string>} The id of the newly created checkout session.
 *
 * @throws Will throw an error if the checkout session cannot be created.
 */
export async function createCheckoutSession(
	userId: string,
	shopId: string,
	cartItems: TCartItem[],
	totalAmount: number,
	partyId?: string
): Promise<string> {
	try {
		const sessionData: SessionData = {
			userId,
			userStripeId: '',
			shopId,
			shopStripeConnectId: '',
			cartItems,
			totalAmount,
			status: 'pending',
			createdAt: new Date().toISOString(),
			partyId: partyId || null
		}

		await setStripeIds(sessionData, userId, shopId)

		const checkoutSessionRef = await firestore()
			.collection('users')
			.doc(userId)
			.collection('checkoutSessions')
			.add(sessionData)
		return checkoutSessionRef.id
	} catch (error) {
		console.error('Error creating checkout session: ', error)
		throw error
	}
}

/**
 * Sets the Stripe IDs for the user and shop in the session data.
 *
 * @param {SessionData} sessionData - The session data object.
 * @param {string} userId - The user's ID.
 * @param {string} shopId - The shop's ID.
 */
async function setStripeIds(
	sessionData: SessionData,
	userId: string,
	shopId: string
): Promise<void> {
	const [userDoc, shopDoc] = await Promise.all([
		firestore().collection('users').doc(userId).get(),
		firestore().collection('shops').doc(shopId).get()
	])

	if (!userDoc.exists || !shopDoc.exists) {
		throw new Error('User or Shop not found in Firestore.')
	}

	const userStripeId = userDoc.data()?.stripeId
	const shopStripeConnectId = shopDoc.data()?.stripeConnectId

	if (!userStripeId || !shopStripeConnectId) {
		throw new Error('Stripe IDs not found for user or shop.')
	}

	sessionData.userStripeId = userStripeId
	sessionData.shopStripeConnectId = shopStripeConnectId
}

/**
 * Fetches the checkout session data from Firestore, including the payment intent.
 *
 * @param {string} userId - Id of the user.
 * @param {string} sessionId - Id of the checkout session to be retrieved.
 * @returns {Promise<SessionData>} A promise that resolves to the checkout session data.
 */
export async function getCheckoutSessionWithPaymentIntent(
	userId: string,
	sessionId: string
): Promise<SessionData> {
	const checkoutSessionRef = firestore()
		.collection('users')
		.doc(userId)
		.collection('checkoutSessions')
		.doc(sessionId)

	try {
		const sessionData = (await checkoutSessionRef.get()).data()
		if (!sessionData) {
			throw new Error('Checkout session not found')
		}

		if (!sessionData.paymentIntent) {
			throw new Error('Payment intent not found in checkout session')
		}

		return sessionData as SessionData
	} catch (error) {
		console.error('Error fetching checkout session with payment intent: ', error)
		throw error
	}
}

/**
 * Updates the status of a checkout session in Firestore.
 * @param {string} userId - Id of the user.
 * @param {string} sessionId - Id of the checkout session to be updated.
 * @param {'payment_intent_created' | 'paid' | 'failed'} status - The new status of the checkout session.
 * @example
 * updateCheckoutSessionStatus('userId', 'sessionId', 'paid')
 */
export async function updateCheckoutSessionStatus(
	userId: string,
	sessionId: string,
	status: 'payment_intent_created' | 'paid' | 'failed'
): Promise<void> {
	const checkoutSessionRef = firestore()
		.collection('users')
		.doc(userId)
		.collection('checkoutSessions')
		.doc(sessionId)

	try {
		await checkoutSessionRef.update({ status })
	} catch (error) {
		console.error('Error updating checkout session status: ', error)
		throw error
	}
}
