import React from 'react'
import { Stack } from 'expo-router'

export default function ShopLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen
				name="[id]"
				options={{
					title: 'Shop 🧾'
				}}
			/>
			<Stack.Screen
				name="CartItemOptions"
				options={{
					title: 'Product Options',
					presentation: 'modal'
				}}
			/>
			<Stack.Screen
				name="cart/index"
				options={{
					title: 'Cart 🛒',
					presentation: 'modal'
				}}
			/>
			<Stack.Screen
				name="party/IntroScreen"
				options={{
					title: 'Party Mode 🎉',
					presentation: 'modal'
				}}
			/>
			<Stack.Screen
				name="party/PartyCodeScreen"
				options={{
					title: 'Min Party',
					presentation: 'modal'
				}}
			/>
		</Stack>
	)
}
