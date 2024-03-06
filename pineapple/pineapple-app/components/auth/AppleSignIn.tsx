import React from 'react'
import { AppleButton } from '@invertase/react-native-apple-authentication'
import { signInWithApple } from '../../utils/firebase/AuthService'

export default function AppleSignIn({ onSignInSuccess }: { onSignInSuccess: () => void }) {
	const handleSignInWithApple = async () => {
		try {
			const result = await signInWithApple()
			if (result) {
				onSignInSuccess && onSignInSuccess()
			}
		} catch (error) {
			console.error('Error signing in with Apple: ', error)
		}
	}

	return (
		<AppleButton
			buttonStyle={AppleButton.Style.WHITE}
			style={{
				height: 45,
				marginTop: 10,
				marginBottom: 20
			}}
			buttonType={AppleButton.Type.SIGN_UP}
			onPress={handleSignInWithApple}
			buttonText="Logg inn med Apple"
		/>
	)
}
