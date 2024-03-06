import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native'
import { TShop } from '../../../utils/types'
import { getShopById } from '../../../utils/firebase/ShopService'
import { router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Octicons } from '@expo/vector-icons'
import MenuItem from '../../../components/ShopScreen/MenuItem'
import { usePartyMode } from '../../../utils/contexts/PartyModeContext'
import { firebase } from '@react-native-firebase/auth'
import { closeParty, getPartyByAdminId } from '../../../utils/firebase/PartyModeService'
import ShopInfo from '../../../components/ShopScreen/ShopInfo'
import TopImage from '../../../components/ShopScreen/TopImage'
import CheckoutButton from '../../../components/ShopScreen/CheckoutButton'
import { useCart } from '../../../utils/contexts/CartContext'

export default function ShopScreen() {
	const [loading, setLoading] = useState(true)
	const [shop, setShop] = useState<TShop>()
	const [error, setError] = useState<Error>()
	const { clearCart, setShopId } = useCart()

	const { isPartyMode, setPartyMode, partyAdmin } = usePartyMode()

	const { id: shopId } = useLocalSearchParams<{ id: string }>()

	const exitPartyMode = async () => {
		try {
			const currentUserId = firebase.auth().currentUser?.uid
			if (currentUserId) {
				const party = await getPartyByAdminId(currentUserId)
				if (party && party.id) {
					await closeParty(party.id)
					setPartyMode(false)
				}
			}
		} catch (error) {
			console.error('Error exiting party mode:', error)
		}
	}

	const handleBackButton = () => {
		setShopId('')
		clearCart()
		router.replace('/')
	}

	useEffect(() => {
		let isMounted = true

		const fetchShop = async () => {
			try {
				const fetchedShop = await getShopById(shopId)
				if (isMounted) {
					setShop(fetchedShop)
				}
			} catch (error) {
				if (isMounted) {
					setError(error as Error)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		fetchShop()

		return () => {
			isMounted = false
		}
	}, [shopId])

	if (error) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Text>{error.message}</Text>
			</View>
		)
	}

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Text>Loading...</Text>
			</View>
		)
	}

	if (!shop) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Text>Shop with id: {shopId} not found</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
				<Octicons name="chevron-left" size={24} color="black" />
			</TouchableOpacity>
			<TopImage shop={shop} />
			<View style={styles.pageWrapper}>
				<FlatList
					data={shop.menu}
					renderItem={({ item }) => <MenuItem menuItem={item} />}
					keyExtractor={(item) => item.name}
					ListHeaderComponent={
						<>
							{isPartyMode && (
								<>
									<Text>You are currently in party mode</Text>
									<Button title="Exit Party Mode" onPress={exitPartyMode} />
								</>
							)}
							{isPartyMode && <Text>{partyAdmin.name ?? 'Admin'} opprettet gruppe for</Text>}
							<Text style={styles.shopName}>{shop.name}</Text>
							<ShopInfo shop={shop} />
							{isPartyMode ? (
								<Text
									style={{
										fontSize: 22,
										marginTop: 50,
										marginBottom: 10
									}}
								>
									Velg hva du vil ha:
								</Text>
							) : (
								<TouchableOpacity
									style={styles.startPartyButton}
									onPress={() =>
										router.push({
											pathname: '/shop/party/IntroScreen',
											params: { shopId }
										})
									}
								>
									<Text style={styles.startPartyButtonText}>🍍 Start Gruppekjøp</Text>
									<Text style={styles.startPartyButtonSubText}>Spar opptil 20%</Text>
								</TouchableOpacity>
							)}
						</>
					}
					style={{
						flexGrow: 0
					}}
				/>
			</View>
			<CheckoutButton />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF'
	},
	backButton: {
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		width: 40,
		height: 40,
		borderRadius: 100,
		position: 'absolute',
		top: 40,
		left: 20,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1
	},
	pageWrapper: {
		flex: 1,
		width: '90%',
		alignSelf: 'center',
		paddingTop: 20
	},
	startPartyButton: {
		backgroundColor: '#0A1B33',
		marginVertical: 24,
		borderRadius: 8,
		padding: 20,
		alignItems: 'center'
	},
	startPartyButtonText: {
		color: 'white',
		fontSize: 20
	},
	startPartyButtonSubText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '200',
		marginTop: 10
	},
	shopName: {
		fontSize: 28,
		fontWeight: '500'
	}
})
