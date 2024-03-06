import { useState, useCallback, useEffect } from 'react'
import { useStripe } from '@stripe/stripe-react-native'
import { firebase } from '@react-native-firebase/firestore'
import { TCartSession } from '../types'
import {
	getCheckoutSessionWithPaymentIntent,
	updateCheckoutSessionStatus
} from '../firebase/CartService'
import { Alert } from 'react-native'
import { useCart } from '../contexts/CartContext'
import { router } from 'expo-router'
import {
	closeParty,
	updatePartyMemberOrderDetails,
	updatePartyMemberStatus
} from '../firebase/PartyModeService'

interface IUseStripePayment {
	userId: string
	sessionId: string
	partyId?: string
	isAdmin?: boolean
}

/**
 * Custom hook to handle Stripe payment flow
 * @param userId - The user's ID
 * @param sessionId - The checkout session ID
 * @returns An object containing the loading state, the session data and a function to open the payment sheet
 */
export const useStripePayment = ({ userId, sessionId, partyId, isAdmin }: IUseStripePayment) => {
	const { presentPaymentSheet, initPaymentSheet } = useStripe()
	const { cartItems, clearCart, totalAmount } = useCart()
	const [loading, setLoading] = useState(false)
	const [sessionData, setSessionData] = useState<TCartSession | null>(null)

	// Fetch and initialize the payment sheet with session data
	const initializePaymentSheet = useCallback(async () => {
		setLoading(true)
		try {
			const sessionDetails = await getCheckoutSessionWithPaymentIntent(userId, sessionId)
			if (sessionDetails) {
				const { customer, ephemeralKey, paymentIntent } = sessionDetails
				if (customer && ephemeralKey && paymentIntent) {
					// Ensure all values are defined
					await initPaymentSheet({
						merchantDisplayName: 'Pineapple Social',
						customerId: customer,
						customerEphemeralKeySecret: ephemeralKey,
						paymentIntentClientSecret: paymentIntent
					})
				} else {
					console.error('One or more required parameters for initPaymentSheet are undefined')
				}
			}
		} catch (error) {
			console.error('Error initializing payment sheet:', error)
			Alert.alert('Error initializing payment sheet')
		}
		setLoading(false)
	}, [userId, sessionId, initPaymentSheet])

	const openPaymentSheet = useCallback(async () => {
		setLoading(true)
		const { error } = await presentPaymentSheet()
		if (error) {
			console.error('Error presenting payment sheet:', error)
			Alert.alert('Error presenting payment sheet')
		} else {
			await updateCheckoutSessionStatus(userId, sessionId, 'paid')
			Alert.alert('Success', 'Your order is confirmed!')
			clearCart()
			router.back()
		}
		setLoading(false)
	}, [userId, sessionId, presentPaymentSheet])

	const confirmPartyPayment = async () => {
		setLoading(true)
		await updateCheckoutSessionStatus(userId, sessionId, 'paid')
		const sessionDetails = await getCheckoutSessionWithPaymentIntent(userId, sessionId)
		partyId &&
				sessionDetails.paymentIntent &&
				updatePartyMemberOrderDetails(
					partyId,
					userId,
					cartItems,
					totalAmount,
					sessionId,
					sessionDetails?.paymentIntent
				)
		// Capture party payments
		await fetch('https://capturepartypayments-2okrq7lpfa-ew.a.run.app', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ partyId })
		})
		Alert.alert('Success', 'Your order is confirmed!')
		partyId && await closeParty(partyId)

		clearCart()
		router.back()
	}

	const openPaymentSheetWithParty = useCallback(async () => {
		setLoading(true)
		const { error } = await presentPaymentSheet()
		if (error) {
			console.error('Error presenting payment sheet:', error)
			Alert.alert('Error presenting payment sheet')
		} else if (isAdmin) {
			confirmPartyPayment()
		} else {
			await updateCheckoutSessionStatus(userId, sessionId, 'paid')
			// Update party member status
			partyId && updatePartyMemberStatus(partyId, userId, 'ready')
			const sessionDetails = await getCheckoutSessionWithPaymentIntent(userId, sessionId)
			partyId &&
				sessionDetails.paymentIntent &&
				updatePartyMemberOrderDetails(
					partyId,
					userId,
					cartItems,
					totalAmount,
					sessionId,
					sessionDetails?.paymentIntent
				)
			Alert.alert(
				'Success',
				'Your order is confirmed! Please wait for the party admin to capture the payment'
			)
		}
		setLoading(false)
	}, [userId, sessionId, presentPaymentSheet])

	// Monitor session status from Firestore
	useEffect(() => {
		if (!userId || !sessionId) return

		const unsubscribe = firebase
			.firestore()
			.collection('users')
			.doc(userId)
			.collection('checkoutSessions')
			.doc(sessionId)
			.onSnapshot(
				(docSnapshot) => {
					if (docSnapshot.exists) {
						const data = docSnapshot.data() as TCartSession
						setSessionData(data)
						setLoading(data.status !== 'payment_intent_created')
						if (data.status === 'payment_intent_created') {
							initializePaymentSheet()
						}
					}
				},
				(error) => console.error('Error listening to session:', error)
			)

		return () => unsubscribe()
	}, [userId, sessionId, initializePaymentSheet])

	return { openPaymentSheet, openPaymentSheetWithParty, loading, sessionData }
}
