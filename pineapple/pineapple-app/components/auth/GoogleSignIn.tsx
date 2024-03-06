import React, { useEffect } from 'react'
import { signInWithGoogle } from '../../utils/firebase/AuthService'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { COLORS } from '../../utils/constants/Colors'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function GoogleSignIn({ onSignInSuccess }: { onSignInSuccess: () => void }) {
	useEffect(() => {
		GoogleSignin.configure({
			webClientId: '919022920074-josg89mt3lmd7d25198m8ddiv0br3be3.apps.googleusercontent.com'
		})
	}, [])

	const handleSignInWithGoogle = async () => {
		try {
			const result = await signInWithGoogle()
			if (result) {
				onSignInSuccess && onSignInSuccess()
			} else {
				console.log('Failed to sign in')
			}
		} catch (error) {
			console.error('Error signing in with Google: ', error)
		}
	}

	return (
		<TouchableOpacity style={styles.button} onPress={handleSignInWithGoogle}>
			<FontAwesome name="google" size={20} />
			<Text style={styles.buttonText}>Sign in with Google</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.gray1,
		paddingVertical: 10,
		paddingHorizontal: 20,
		height: 45,
		borderRadius: 5,
		marginBottom: 20
	},
	buttonText: {
		color: COLORS.gray10,
		fontSize: 17,
		marginLeft: 5,
		fontWeight: '500'
	}
})
