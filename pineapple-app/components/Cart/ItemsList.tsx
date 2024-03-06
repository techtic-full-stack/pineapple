import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../utils/contexts/CartContext'
import { useAuth } from '../../utils/contexts/AuthContext'

export default function ItemsList() {
	const { user } = useAuth()
	const { cartItems, removeFromCart } = useCart()

	const handleRemoveItem = (index: number) => {
		removeFromCart(index)
	}

	const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0)

	return (
		<View style={styles.cartList}>
			<View style={styles.cartItemsHeader}>
				<Text style={styles.userName}>{user?.name}</Text>
				<Text style={styles.totalSum}>Totalt: {totalAmount}kr</Text>
			</View>
			{cartItems.length === 0 ? (
				<Text style={styles.placeholderText}>🛒 Din handlevogn er tom</Text>
			) : (
				cartItems.map((item, index) => (
					<View key={index} style={styles.cartItem}>
						<View>
							<TouchableOpacity
								onPress={() => {
									handleRemoveItem(index)
								}}
							>
								<Ionicons name="close-circle-outline" size={24} color="black" />
							</TouchableOpacity>
						</View>
						<View style={styles.itemText}>
							<View>
								<Text style={styles.itemName}>{item.name}</Text>
								<Text style={styles.itemPrice}>
									x {item.quantity}{' '}
									{item.options && item.options.length > 0 ? 'med ' + item.options : ''}
								</Text>
							</View>
							<Text style={styles.itemPrice}>{item.price}kr</Text>
						</View>
					</View>
				))
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	cartList: {
		marginTop: 24,
		padding: 15,
		borderRadius: 8,
		shadowColor: 'rgba(138, 149, 158, 0.4)',
		backgroundColor: 'white',
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowRadius: 10,
		shadowOpacity: 0.5
	},
	cartItemsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	userName: {
		fontSize: 16,
		fontWeight: '500'
	},
	totalSum: {
		fontSize: 14,
		color: '#808080'
	},
	placeholderText: {
		marginVertical: 20,
		fontSize: 16,
		fontWeight: '500',
		color: '#808080'
	},
	cartItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		paddingVertical: 10
	},
	itemText: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: 10
	},
	itemName: {
		fontSize: 16
	},
	itemPrice: {
		fontSize: 14,
		color: '#808080'
	}
})
