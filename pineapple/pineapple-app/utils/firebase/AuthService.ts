import { GoogleSignin } from '@react-native-google-signin/google-signin'

// import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import firestore from '@react-native-firebase/firestore'

export async function signInWithGoogle() {
	// Check if your device supports Google Play
	await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
	// Get the users ID token
	const { idToken } = await GoogleSignin.signIn()

	// Create a Google credential with the token
	const googleCredential = auth.GoogleAuthProvider.credential(idToken)

	// Sign-in the user with the credential
	const authResult = await auth().signInWithCredential(googleCredential)

	return authResult
}

export async function signInWithApple() {
	// Start the sign-in request
	const appleAuthRequestResponse = await appleAuth.performRequest({
		requestedOperation: appleAuth.Operation.LOGIN,
		// As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
		// See: https://github.com/invertase/react-native-apple-authentication#faqs
		requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
	})

	// Ensure Apple returned a user identityToken
	if (!appleAuthRequestResponse.identityToken) {
		throw new Error('Apple Sign-In failed - no identify token returned')
	}

	// Create a Firebase credential from the response
	const { identityToken, nonce } = appleAuthRequestResponse
	const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)

	// Sign the user in with the credential
	return auth().signInWithCredential(appleCredential)
}

// Apple also requires that the app revoke the Sign in with Apple token when the user chooses to delete their account.
// TODO: Implement this function when the user chooses to delete their account.
// async function revokeSignInWithAppleToken() {
// 	// Get an authorizationCode from Apple
// 	const { authorizationCode } = await appleAuth.performRequest({
// 		requestedOperation: appleAuth.Operation.REFRESH
// 	})

// 	// Ensure Apple returned an authorizationCode
// 	if (!authorizationCode) {
// 		throw new Error('Apple Revocation failed - no authorizationCode returned')
// 	}

// 	// Revoke the token
// 	return auth().revokeToken(authorizationCode)
// }

export async function checkFirstTimeSignIn() {
	const currentUser = auth().currentUser
	if (!currentUser) {
		return false
	}

	try {
		const userDoc = await firestore().collection('users').doc(currentUser.uid).get()

		if (!userDoc.exists) {
			return true
		}

		const userData = userDoc.data()
		return userData?.name == null || userData?.name == ''
	} catch (error) {
		console.error('Error checking first-time sign-in:', error)
		throw error
	}
}

export async function signOut() {
	auth().signOut()
}
