import React, { useEffect } from 'react'
import { Text } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, router } from 'expo-router'
import { StripeProvider } from '@stripe/stripe-react-native'
import { STRIPE_PUBLISHABLE_KEY } from '../utils/constants/Env'
import { CartProvider } from '../utils/contexts/CartContext'
import { PartyModeProvider } from '../utils/contexts/PartyModeContext'
import { AuthProvider, useAuth } from '../utils/contexts/AuthContext'
import { OptionsProvider } from '../utils/contexts/ItemOptionsContext'

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
	Redirect
} from 'expo-router'

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(root)'
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font
	})

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return (
		<AuthProvider>
			<StripeProvider
				publishableKey={STRIPE_PUBLISHABLE_KEY || ''}
				urlScheme="com.maiuranloganathan.pineapplesocial"
				merchantIdentifier="merchant.com.maiuranloganathan.pineapplesocial"
			>
				<PartyModeProvider>
					<CartProvider>
						<OptionsProvider>
							<AuthenticatedApp />
						</OptionsProvider>
					</CartProvider>
				</PartyModeProvider>
			</StripeProvider>
		</AuthProvider>
	)
}

/**
 *
 * @returns The main app if the user is authenticated, otherwise the auth screen.
 */
function AuthenticatedApp() {
	const { user, isLoading } = useAuth()
	useEffect(() => {
		if (!isLoading && !user) {
			router.replace('/SignInScreen')
		}
	}, [user, isLoading])

	if (isLoading) {
		return <Text>Loading...</Text>
	}

	return user ? <RootLayoutNav /> : <AuthLayout />
}

function RootLayoutNav() {
	return (
		<Stack>
			<Stack.Screen name="(root)" options={{ headerShown: false }} />
			<Stack.Screen name="(afterSignUp)" options={{ headerShown: false }} />
			<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
		</Stack>
	)
}

function AuthLayout() {
	return (
		<Stack>
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
		</Stack>
	)
}
