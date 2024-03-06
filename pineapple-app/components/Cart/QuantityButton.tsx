import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const QuantityButton = ({
	quantity,
	setQuantity
}: {
	quantity: number
	setQuantity: React.Dispatch<React.SetStateAction<number>>
}) => {
	const handleIncrement = () => {
		setQuantity((prevQuantity) => prevQuantity + 1)
	}

	const handleDecrement = () => {
		if (quantity > 1) {
			setQuantity((prevQuantity) => prevQuantity - 1)
		}
	}

	return (
		<View style={styles.quantityControl}>
			<TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
				<Text style={styles.quantityButtonText}>—</Text>
			</TouchableOpacity>
			<Text style={styles.quantityText}>{quantity}</Text>
			<TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
				<Text style={styles.quantityButtonText}>+</Text>
			</TouchableOpacity>
		</View>
	)
}

export default QuantityButton

const styles = StyleSheet.create({
	// Quantity control
	quantityControl: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		width: 124,
		height: 48,
		borderColor: '#E8E8E8',
		borderWidth: 1,
		borderRadius: 100
	},
	quantityButton: {
		borderRadius: 6,
		padding: 5
	},
	quantityButtonText: {
		fontSize: 18,
		color: '#333'
	},
	quantityText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#090A0A'
	}
})
