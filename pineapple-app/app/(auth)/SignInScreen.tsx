import React from 'react'
import { StyleSheet, View, StatusBar, Text, Platform } from 'react-native'
import PhoneSignIn from '../../components/auth/PhoneSignIn'
import AppleSignIn from '../../components/auth/AppleSignIn'
import GoogleSignin from '../../components/auth/GoogleSignIn'
import { router } from 'expo-router'
// import { checkFirstTimeSignIn } from '../../utils/firebase/AuthService' // Import the function to check if it's the user's first sign-in
import { COLORS } from '../../utils/constants/Colors'

export default function SignInScreen() {
	const handleSignInSuccess = async () => {
		// const firstTime = await checkFirstTimeSignIn()
		// if (firstTime) {
		// 	router.push('/(afterSignUp)/FillNameScreen')
		// } else {
		// 	router.replace('/')
		// }
		router.replace('/')
	}
	return (
		<View style={styles.container}>
			<Text style={styles.header}>Velkommen til{'\n'}Pineapple🍍</Text>
			<Text style={styles.subText}>
				Logg inn ved å bruke ditt telefonnummer og den tilsendte koden du mottar via SMS.
			</Text>
			<PhoneSignIn onSignInSuccess={handleSignInSuccess} />
			<View style={styles.separator}>
				<View style={styles.separatorLine} />
				<Text style={{ color: COLORS.gray5, marginHorizontal: 10 }}>ELLER</Text>
				<View style={styles.separatorLine} />
			</View>
			{Platform.OS === 'ios' && <AppleSignIn onSignInSuccess={handleSignInSuccess} />}
			<GoogleSignin onSignInSuccess={handleSignInSuccess} />
			<Text style={{ color: COLORS.gray5, marginTop: 20, textAlign: 'center' }}>
				Ved å logge inn godtar du våre{' '}
				<Text style={{ color: COLORS.gray7, textDecorationLine: 'underline' }}>
					Brukervilkår og Personvernerklæring
				</Text>
				.
			</Text>
			<StatusBar barStyle={'light-content'} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 100,
		paddingHorizontal: 20,
		backgroundColor: '#0F161E'
	},
	header: {
		fontSize: 36,
		width: 'auto',
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#fff'
	},
	subText: {
		fontSize: 16,
		width: 'auto',
		marginBottom: 40,
		color: COLORS.gray5
	},
	separator: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30,
		marginBottom: 20
	},
	separatorLine: {
		flex: 1,
		height: 1,
		backgroundColor: COLORS.gray6
	}
})
