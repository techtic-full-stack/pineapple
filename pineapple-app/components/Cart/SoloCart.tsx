import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function SoloCart() {
	return (
		<View>
			<Text style={styles.title}>Min bestilling</Text>
			<Text style={styles.desciption}>
				Husk at du kan få opptil 20% rabatt ved å kjøpe med venner
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 23,
		marginTop: 24
	},
	desciption: {
		fontSize: 16,
		marginTop: 14
	}
})
