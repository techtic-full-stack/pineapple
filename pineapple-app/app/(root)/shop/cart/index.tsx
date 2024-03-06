import React, { useEffect, useState } from 'react'
import { View, Text, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { usePartyMode } from '../../../../utils/contexts/PartyModeContext'
import { getPartyById, getPartyMembers } from '../../../../utils/firebase/PartyModeService'
import ModalHeader from '../../../../components/Modals/ModalHeader'
import ModalContainer from '../../../../components/Modals/ModalContainer'
import ModalMainContent from '../../../../components/Modals/ModalMainContent'
import ItemsList from '../../../../components/Cart/ItemsList'
import SoloCart from '../../../../components/Cart/SoloCart'
import PartyCart from '../../../../components/Cart/PartyCart'
import { createCheckoutSession } from '../../../../utils/firebase/CartService'
import { useAuth } from '../../../../utils/contexts/AuthContext'
import { useCart } from '../../../../utils/contexts/CartContext'
import { router } from 'expo-router'

import { useStripePayment } from '../../../../utils/hooks/useStripePayment'

export default function Cart() {
	const { isPartyMode, currentPartyId, currentShopId, setPartyMembers, setPartyCode, partyAdmin } =
		usePartyMode()
	const { user } = useAuth()
	const { cartItems, totalAmount, shopId, clearCart } = useCart()
	const [sessionId, setSessionId] = useState<string | null>(null)

	const { loading, openPaymentSheet, openPaymentSheetWithParty } = useStripePayment({
		userId: user?.id || '',
		sessionId: sessionId || '',
		partyId: currentPartyId,
		isAdmin: user?.id === partyAdmin.id
	})

	useEffect(() => {
		// Function to fetch party members and set party code
		async function fetchPartyData() {
			if (currentPartyId) {
				try {
					const members = await getPartyMembers(currentPartyId)
					setPartyMembers(members)

					const party = await getPartyById(currentPartyId)
					if (party) setPartyCode(party.code)
				} catch (error) {
					console.error('Error fetching party data (cart):', error)
				}
			}
		}

		// Function to create a checkout session
		async function createSession() {
			const effectiveShopId = isPartyMode ? currentShopId : shopId
			if (user && effectiveShopId && cartItems.length > 0 && totalAmount > 0) {
				console.log('Creating checkout session')
				try {
					const newSessionId = await createCheckoutSession(
						user.id,
						effectiveShopId,
						cartItems,
						totalAmount,
						currentPartyId
					)
					setSessionId(newSessionId)
				} catch (error) {
					console.error('Error creating checkout session:', error)
				}
			}
		}

		// Execute both functions
		if (isPartyMode && currentPartyId) {
			fetchPartyData() // Fetch party data only if in party mode
		}

		createSession() // Always attempt to create a session if conditions are met
	}, [isPartyMode, currentPartyId, user, shopId, currentShopId, cartItems, totalAmount])

	{
		isPartyMode &&
			useEffect(() => {
				const fetchPartyMembers = async () => {
					try {
						console.log('Fetching party members')
						const members = await getPartyMembers(currentPartyId)
						setPartyMembers(members)
					} catch (error) {
						console.error('Error fetching party members:', error)
					}
				}
				const fetchParty = async () => {
					try {
						const party = await getPartyById(currentPartyId)
						party && setPartyCode(party.code)
					} catch (error) {
						console.error('Error fetching party:', error)
					}
				}

				fetchPartyMembers()
				fetchParty()
			}, [currentPartyId, setPartyMembers, isPartyMode, setPartyCode, partyAdmin])
	}

	const handlePayment = async () => {
		if (cartItems.length === 0) {
			Alert.alert('Ingen varer i handlevognen', 'Legg til varer i handlevognen før du betaler')
			return
		}

		if (!sessionId) {
			console.error('Error fetching checkout session, sessionId is null')
			return
		}

		isPartyMode ? await openPaymentSheetWithParty() : await openPaymentSheet()
	}

	const handleCancel = () => {
		Alert.alert('Kanseller bestilling', 'Er du sikker på at du vil kansellere bestillingen?', [
			{ text: 'Avbryt', isPreferred: true, style: 'cancel' },
			{
				text: 'Kanseller',
				onPress: () => {
					clearCart()
					router.back()
				}
			}
		])
	}

	return (
		<ModalContainer>
			<ModalHeader title="Bestillingsoversikt" />

			<ModalMainContent>
				{isPartyMode ? <PartyCart /> : <SoloCart />}
				<ItemsList />
			</ModalMainContent>

			<View style={styles.buttonGroup}>
				<TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
					<Text style={styles.cancelButtonText}>Kanseller</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handlePayment} style={styles.payButton}>
					{loading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Text style={styles.payButtonText}>
							{isPartyMode && user?.id === partyAdmin.id ? 'Bekreft for gruppa' : ''}
							{isPartyMode && user?.id !== partyAdmin.id ? 'Bekreft for deg' : ''}
							{!isPartyMode && 'Bekreft'}
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</ModalContainer>
	)
}

const styles = StyleSheet.create({
	buttonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderTopColor: '#E8E8E8',
		borderTopWidth: 1,
		width: '100%',
		padding: 16,
		marginBottom: 24,
		flexGrow: 0,
		flexShrink: 0
	},
	cancelButton: {
		paddingHorizontal: 24,
		paddingVertical: 16
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#999999'
	},
	payButton: {
		backgroundColor: '#0F161E',
		paddingHorizontal: 24,
		paddingVertical: 16,
		borderRadius: 12
	},
	payButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	}
})
