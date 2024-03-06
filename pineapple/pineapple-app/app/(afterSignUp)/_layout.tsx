import React from 'react'
import { Stack } from 'expo-router'

export default function AuthLayout() {
	return (
		<Stack
			initialRouteName="FillNameScreen"
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="FillNameScreen" />
			<Stack.Screen name="PickImageScreen" />
		</Stack>
	)
}
