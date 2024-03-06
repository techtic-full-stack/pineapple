import React from 'react'
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native'
import { TShop } from '../../utils/types'

export default function MediumShopCard({
	shop,
	onShopSelect
}: {
	shop: TShop
	onShopSelect: (shopId: string) => void
}) {
	return (
		<TouchableOpacity onPress={() => onShopSelect(shop.documentId)}>
			<View style={styles.card}>
				<Image source={{ uri: shop.image }} style={styles.image} />
				<View style={styles.textContainer}>
					<View>
						<Text style={styles.name}>{shop.name}</Text>
						<Text>{shop.location}</Text>
					</View>
					<Text
						style={{
							fontSize: 13.13,
							fontWeight: 'bold'
						}}
					>
						Åpent nå
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginVertical: 8,
		marginHorizontal: 16,
		overflow: 'hidden'
	},
	textContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 5.81,
		paddingHorizontal: 10
	},
	image: {
		width: '100%',
		height: 160, // Adjust the height as needed
		resizeMode: 'cover',
		borderRadius: 15
	},
	name: {
		fontSize: 13.13,
		fontWeight: '500'
	}
})
