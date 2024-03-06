import React from 'react'
import { Stack } from 'expo-router'

export default function AuthLayout() {
	return (
		<Stack
			initialRouteName="SignInScreen"
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="SignInScreen" />
		</Stack>
	)
}
