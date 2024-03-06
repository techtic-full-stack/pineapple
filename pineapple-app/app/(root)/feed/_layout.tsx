import React from 'react'
import { Stack } from 'expo-router'

export default function feedLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="FeedScreen"
				options={{
					headerShown: false
				}}
			/>
		</Stack>
	)
}
