import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS } from '../../utils/constants/Colors'
import { useOptions } from '../../utils/contexts/ItemOptionsContext'

import { router } from 'expo-router'
import { TMenuItem } from '../../utils/types'

export default function MenuItem({ menuItem }: { menuItem: TMenuItem }) {
	const { selectItem } = useOptions()

	const handleAddToCart = () => {
		selectItem(menuItem)
		router.push('/shop/CartItemOptions')
	}

	return (
		<TouchableOpacity onPress={handleAddToCart} style={styles.container}>
			<Image
				source={{ uri: menuItem.image || '../../assets/images/icon.png' }}
				style={styles.image}
			/>
			<View style={styles.textContainer}>
				<Text style={styles.title}>{menuItem.name}</Text>
				<Text style={styles.description}>{menuItem.description}</Text>
				<Text style={styles.price}>{menuItem.price},-</Text>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 14,
		padding: 14,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F1F3FF',
		borderRadius: 8
	},
	image: {
		width: 80,
		height: 80,
		marginRight: 14,
		borderRadius: 8
	},
	textContainer: {
		flex: 1
	},
	title: {
		fontSize: 20
	},
	description: {
		color: COLORS.gray8,
		fontSize: 16,
		marginBottom: 5
	},
	price: {
		fontSize: 14,
		fontWeight: 'bold'
	}
})
