import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { useOptions } from '../../../utils/contexts/ItemOptionsContext'
import { useCart } from '../../../utils/contexts/CartContext'
import { Redirect, router } from 'expo-router'
import RadioGroup from '../../../components/RadioGroup'
import { TCartItem, TMenuItem } from '../../../utils/types'
import ModalHeader from '../../../components/Modals/ModalHeader'
import ModalContainer from '../../../components/Modals/ModalContainer'
import ModalMainContent from '../../../components/Modals/ModalMainContent'
import QuantityButton from '../../../components/Cart/QuantityButton'

export default function CartItemOptions() {
	const { selectedItem, clearSelectedItem } = useOptions()
	const { addToCart } = useCart()
	const [quantity, setQuantity] = useState(1)
	const [selectedOption, setSelectedOption] = useState('')

	const prepareItemForCart = (item: TMenuItem): TCartItem => {
		const selectedOptionsNames: string[] = []

		item.optionCategories.forEach((category) => {
			const option = category.options.find((o) => o.id === selectedOption)
			if (option) {
				selectedOptionsNames.push(option.name)
			}
		})

		return {
			id: item.id,
			name: item.name,
			price: calculateTotalPrice,
			quantity: quantity,
			options: selectedOptionsNames.toString()
		}
	}

	const handleFinalizeOptions = (customizedItem: TMenuItem) => {
		addToCart(prepareItemForCart(customizedItem))
		clearSelectedItem()
		router.back()
	}

	const calculateTotalPrice = useMemo(() => {
		const optionsPrice =
			selectedItem?.optionCategories.reduce((acc, category) => {
				const option = category.options.find((o) => o.id === selectedOption)
				return acc + (option?.price || 0)
			}, 0) || 0

		return ((selectedItem?.price || 0) + optionsPrice) * quantity
	}, [selectedItem, quantity, selectedOption])

	if (!selectedItem) {
		return <Redirect href={'/'} />
	}

	return (
		<ModalContainer>
			<ModalHeader title="Name of the Shop" divider={false} />
			<Image source={{ uri: selectedItem.image || '' }} style={styles.cartItemImage} />

			<ModalMainContent>
				<View style={styles.namePriceContainer}>
					<Text style={styles.cartItemName}>{selectedItem?.name}</Text>
					<Text>{selectedItem.price} kr</Text>
				</View>
				<Text style={styles.cartItemDescription}>{selectedItem.description}</Text>

				{selectedItem.optionCategories.map((optionCategory, index) => (
					<View style={styles.optionsContainer} key={index}>
						<View style={styles.optionHeader}>
							<Text style={styles.optionTitle}>{optionCategory.name}</Text>
							<Text style={styles.optionSubTitle}>Velg en</Text>
						</View>
						<RadioGroup
							options={optionCategory.options}
							selectedValue={selectedOption}
							onSelect={setSelectedOption}
						/>
					</View>
				))}
			</ModalMainContent>

			<View style={styles.buttonGroup}>
				<QuantityButton quantity={quantity} setQuantity={setQuantity} />

				<TouchableOpacity
					onPress={() => selectedItem && handleFinalizeOptions(selectedItem)}
					style={styles.addToCartButton}
				>
					<Text style={styles.addToCartButtonText}>Legg til: kr {calculateTotalPrice}</Text>
				</TouchableOpacity>
			</View>
		</ModalContainer>
	)
}

const styles = StyleSheet.create({
	cartItemImage: {
		width: '100%',
		height: 150
	},
	cartItemName: {
		fontSize: 22
	},
	cartItemPrice: {
		fontSize: 14
	},
	namePriceContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 24
	},
	cartItemDescription: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: '200'
	},

	// Options
	optionsContainer: {
		marginTop: 50
	},
	optionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16
	},
	optionTitle: {
		fontSize: 16
	},
	optionSubTitle: {
		fontSize: 14,
		fontWeight: '200'
	},

	// Add to cart
	addToCartButton: {
		backgroundColor: '#0F161E',
		paddingHorizontal: 24,
		paddingVertical: 16,
		borderRadius: 12
	},
	addToCartButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	buttonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderTopColor: '#E8E8E8',
		borderTopWidth: 1,
		width: '100%',
		padding: 16,
		marginBottom: 24,
		flexGrow: 0,
		flexShrink: 0
	}
})
