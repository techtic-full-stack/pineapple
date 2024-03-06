import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePartyMode } from '../../utils/contexts/PartyModeContext'
import { useAuth } from '../../utils/contexts/AuthContext'
import { joinParty } from '../../utils/firebase/PartyModeService'
import { router } from 'expo-router'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

export default function JoinPartyBanner() {
	const { setPartyMode, setCurrentPartyId, setCurrentShopId } = usePartyMode()
	const { user } = useAuth()
	const [partyCode, setPartyCode] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const opacity = useSharedValue(0)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value
		}
	})

	useEffect(() => {
		if (errorMessage) {
			opacity.value = withTiming(1, { duration: 500 })

			const timer = setTimeout(() => {
				opacity.value = withTiming(0, { duration: 500 })
				setTimeout(() => setErrorMessage(''), 500) // Clear message after fade-out
			}, 5000) // 5 seconds delay

			return () => clearTimeout(timer)
		}
	}, [errorMessage, opacity])

	useEffect(() => {
		if (partyCode.length === 6) {
			handleJoinParty()
		}
	}, [partyCode])

	const handleJoinParty = async () => {
		if (!user?.id) {
			console.error('User not logged in')
			return
		}
		try {
			const partyData = await joinParty(partyCode, user.id)
			if (!partyData) return

			setCurrentPartyId(partyData.id)
			setPartyCode(partyCode)
			setCurrentShopId(partyData.shopId)
			setPartyMode(true)

			router.push({
				pathname: '/(root)/shop/[id]',
				params: { id: partyData.shopId }
			})
		} catch (error) {
			console.error('Error joining party:', error)
			let message = 'Det oppstod en feil ved innmelding i gruppen'
			if (error instanceof Error) {
				switch (error.message) {
					case 'Party does not exist':
						message = 'Gruppen eksisterer ikke'
						break
					case 'User is already a member of this party':
						message = 'Du er allerede medlem av denne gruppen'
						break
				}
			}
			setErrorMessage(message)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<Text style={styles.title}>Join gruppekjøp</Text>
				<View style={{ alignItems: 'center' }}>
					<View style={styles.card}>
						<TextInput
							style={styles.input}
							placeholder="123456"
							placeholderTextColor={'rgba(255, 255, 255, 0.3)'}
							autoCapitalize="characters"
							autoCorrect={false}
							onChangeText={setPartyCode}
							value={partyCode}
							maxLength={6}
						/>
						<Text style={styles.subtitle}>Lim inn gruppekjøp kode</Text>
					</View>
				</View>
			</View>
			{errorMessage ? (
				<Animated.Text style={[styles.errorMessage, animatedStyle]}>
					⚠️ {errorMessage}
				</Animated.Text>
			) : (
				<Text> </Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center'
	},
	inputContainer: {
		marginTop: 23.35,
		width: '90%',
		flexDirection: 'column'
	},
	card: {
		marginTop: 19,
		backgroundColor: '#242D42',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		height: 97.38,
		width: 268
	},
	title: {
		fontSize: 19.13,
		fontWeight: '500',
		color: '#061023'
	},
	subtitle: {
		marginTop: 10,
		fontSize: 12.6,
		color: '#FFF'
	},
	input: {
		color: '#ffffff',
		fontWeight: 'bold',
		fontSize: 26,
		letterSpacing: 2
	},
	errorMessage: {
		textAlign: 'center',
		fontSize: 12.6,
		marginTop: 10
	}
})
