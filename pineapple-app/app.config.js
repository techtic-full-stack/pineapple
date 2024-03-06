export default {
	expo: {
		name: 'pineapple',
		slug: 'pineapple',
		version: '7.1.2',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'com.maiuranloganathan.pineapplesocial',
		userInterfaceStyle: 'automatic',
		splash: {
			image: './assets/images/splash.png',
			resizeMode: 'contain',
			backgroundColor: '#ffffff'
		},
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: true,
			bundleIdentifier: 'com.maiuranloganathan.pineapplesocial',
			infoPlist: {
        "NSCameraUsageDescription": "Pineapple requires access to your camera to allow you to upload profile pictures and share moments with friends."
      },
			googleServicesFile: './GoogleService-Info.plist',
			usesAppleSignIn: true
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff'
			},
			package: 'com.maiuranloganathan.pineapplesocial',
			googleServicesFile: './google-services.json'
		},
		web: {
			bundler: 'metro',
			output: 'server',
			favicon: './assets/images/favicon.png'
		},
		plugins: [
			'expo-router',
			[
				'expo-build-properties',
				{
					ios: {
						useFrameworks: 'static'
					}
				}
			],
			'@react-native-google-signin/google-signin',
			'@react-native-firebase/app',
			'@react-native-firebase/auth',
			[
				'@stripe/stripe-react-native',
				{
					merchantIdentifier: 'merchant.com.maiuranloganathan.pineapplesocial',
					enableGooglePay: true
				}
			]
		],
		experiments: {
			typedRoutes: true
		},
		extra: {
			router: {
				origin: false
			},
			eas: {
				projectId: '7758d7dd-4ce6-4089-9fe6-d65c6ed0642b'
			}
		}
	}
}
