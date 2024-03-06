import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function FillNameScreen() {
	return (
		<View style={styles.container}>
			<Text>FillNameScreen</Text>
			<Button
				title="Can go back?"
				onPress={() => console.log('Can go back?', router.canGoBack())}
			/>
			<Button title="Go back for testing" onPress={() => router.back()} />
			<Button title="Go to next screen" onPress={() => router.push('/PickImageScreen')} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})
