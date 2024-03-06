import { useState } from 'react'
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native'
import MediumShopCard from '../Cards/MediumShopCard'
import { Octicons } from '@expo/vector-icons'
import { TShop } from '../../utils/types'
import { useCart } from '../../utils/contexts/CartContext'
import { router } from 'expo-router'

export default function ShopsList({ shops }: { shops: TShop[] }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('Alle')
	const { setShopId } = useCart()

	const filteredShops = shops.filter(
		(shop) =>
			shop.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
			(activeCategory === 'Alle' || shop.category === activeCategory)
	)

	const handleCategoryPress = (category: string) => {
		setActiveCategory(category)
	}

	const getButtonTextStyle = (category: string) => {
		return activeCategory === category ? styles.sortingTextActive : styles.sortingText
	}

	const handleShopSelect = (shopId: string) => {
		setShopId(shopId)
		router.push(`/shop/${shopId}`)
	}

	return (
		<View style={styles.container}>
			<Text style={{ fontSize: 19.13, fontWeight: '500', color: '#061023' }}>Start gruppekjøp</Text>
			<View style={styles.searchView}>
				<Octicons name="search" size={24} color="#4F5663" style={styles.searchIcon} />
				<TextInput
					style={styles.searchInput}
					placeholder="Hvilken butikk ser du etter?"
					placeholderTextColor="#4F5663"
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
			</View>

			<View style={styles.sortingView}>
				<TouchableOpacity
					style={styles.sortingButtonSpecial}
					onPress={() => handleCategoryPress('Alle')}
				>
					<Text style={styles.sortingText}>Alle</Text>
				</TouchableOpacity>
				{['Café', 'Dessert', 'Kebab'].map((category) => (
					<TouchableOpacity
						key={category}
						style={styles.sortingButton}
						onPress={() => handleCategoryPress(category)}
					>
						<Text style={getButtonTextStyle(category)}>{category}</Text>
					</TouchableOpacity>
				))}
			</View>

			<FlatList
				data={filteredShops}
				renderItem={({ item }) => (
					<MediumShopCard shop={item} key={item.documentId} onShopSelect={handleShopSelect} />
				)}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 26.62,
		width: '90%'
	},
	sortingView: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginVertical: 10,
		overflow: 'scroll'
	},
	sortingButton: {
		backgroundColor: '#E6EAF2',
		borderRadius: 100,
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginRight: 10
	},
	sortingButtonSpecial: {
		backgroundColor: '#ffffff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
		borderRadius: 100,
		paddingHorizontal: 60,
		paddingVertical: 10,
		marginRight: 10
	},
	sortingText: {
		color: '#061023',
		fontSize: 14
	},
	sortingTextActive: {
		color: '#061023',
		fontSize: 14,
		fontWeight: 'bold'
	},
	searchView: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 10,
		padding: 15,
		marginTop: 17,
		marginHorizontal: 10
	},
	searchIcon: {
		marginRight: 10
	},
	searchInput: {
		flex: 1,
		fontSize: 12.5
	}
})
