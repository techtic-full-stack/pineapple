export type TCartItem = {
	id: string
	name: string
	price: number
	options?: string
	quantity: number
}

export type TCartSession = {
	cartItems: Array<TCartItem>
	createdAt: string
	// ---Stripe---
	customer: string
	ephemeralKey: string
	paymentIntent: string
	publishableKey: string
	// ---End Stripe---
	partyId: string | null
	shopId: string
	shopStripeConnectId: string
	status: 'pending' | 'payment_intent_created' | 'paid'
	totalAmount: number
	userId: string
	userStripeId: string
}