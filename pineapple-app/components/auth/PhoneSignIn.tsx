import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, Button } from 'react-native'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { FontAwesome } from '@expo/vector-icons'
import { COLORS } from '../../utils/constants/Colors'
// import { router } from 'expo-router'

export default function PhoneSignIn({ onSignInSuccess }: { onSignInSuccess: () => void }) {
	const [phoneNumber, setPhoneNumber] = useState('')
	const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null)
	const [code, setCode] = useState('')

	async function signInWithPhoneNumber() {
		try {
			const fullNumber = `+47${phoneNumber}`
			const confirmation = await auth().signInWithPhoneNumber(fullNumber)
			setConfirm(confirmation)
		} catch (error) {
			console.error('Phone sign-in failed', error)
		}
	}

	const confirmCode = async () => {
		try {
			if (confirm) {
				await confirm.confirm(code)
				onSignInSuccess && onSignInSuccess()
			}
		} catch (error) {
			console.error('Invalid code', error)
			Alert.alert('Invalid code.')
		}
	}

	const tryAnotherNumber = () => {
		setConfirm(null)
	}

	if (!confirm) {
		return (
			<View>
				<Text style={styles.prefix}>+47</Text>
				<TextInput
					style={[styles.input, styles.inputWithPrefix]}
					onChangeText={setPhoneNumber}
					value={phoneNumber}
					placeholder="Telefonnummer"
					keyboardType="phone-pad"
					placeholderTextColor={COLORS.gray7}
				/>
				<TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
					<FontAwesome name="phone" size={20} color={COLORS.gray1} />
					<Text style={styles.buttonText}>Send Kode</Text>
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<View>
			<TextInput
				value={code}
				style={styles.input}
				onChangeText={setCode}
				placeholder="Kode"
				keyboardType="number-pad"
				placeholderTextColor={COLORS.gray7}
			/>
			<TouchableOpacity style={styles.button} onPress={confirmCode}>
				<Text style={styles.buttonText}>Bekreft koden</Text>
			</TouchableOpacity>
			<Text style={{ color: COLORS.gray5, marginTop: 10, textAlign: 'center' }}>Eller</Text>
			<Button title="Prøv et annet nummer" onPress={tryAnotherNumber} />
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#333'
	},
	input: {
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 5,
		minWidth: 200,
		padding: 12,
		marginBottom: 20,
		textAlign: 'left',
		fontSize: 16,
		color: 'white'
	},
	inputWithPrefix: {
		paddingLeft: 50
	},
	prefix: {
		position: 'absolute',
		left: 15,
		top: 12.75,
		fontSize: 16,
		color: 'white'
	},
	button: {
		flexDirection: 'row',
		backgroundColor: COLORS.blue5,
		height: 45,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10
	},
	buttonText: {
		color: COLORS.gray1,
		fontSize: 16,
		marginLeft: 10
	}
})
