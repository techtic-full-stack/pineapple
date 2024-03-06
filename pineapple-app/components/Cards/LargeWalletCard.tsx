// PurchasedItemCard.js
import React from 'react'
import { StyleSheet, Image, Button, View, Text } from 'react-native'

type TProps = {
	vendorName: string
	balance: number
	imageUrl: string
}

export default function LargeWalletCard({ vendorName, balance, imageUrl }: TProps) {
	return (
		<View style={styles.card}>
			<Image
				source={{ uri: imageUrl }} // Replace with actual image URL
				style={styles.image}
			/>
			<View style={styles.textContainer}>
				<Text style={styles.vendorName}>{vendorName}</Text>
				<Text style={styles.balance}>Balance: ${balance}</Text>
			</View>
			<Button
				title="Bruk"
				onPress={() => {
					/* handle the press event */
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'white',
		flexDirection: 'row', // Align items in a row
		alignItems: 'center', // Center items vertically
		justifyContent: 'space-between', // Space between items
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 10,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3
	},
	image: {
		width: 50, // Set your desired width
		height: 50, // Set your desired height
		borderRadius: 25 // Optional, for rounded images
	},
	textContainer: {
		// Add styles if needed, like padding
	},
	vendorName: {
		color: 'black',
		fontSize: 18,
		fontWeight: 'bold'
	},
	balance: {
		fontSize: 16,
		color: 'grey',
		marginTop: 4
	}
})
