// PurchasedItemsScreen.js
import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import LargeWalletCard from '../Cards/LargeWalletCard'

const purchasedItems = [
	// Sample data
	{
		id: '1',
		vendorName: 'Vendor 1',
		balance: 120.5,
		imageUrl: 'https://picsum.photos/500/300?random=3'
	},
	{
		id: '2',
		vendorName: 'Vendor 2',
		balance: 85.75,
		imageUrl: 'https://picsum.photos/500/300?random=4'
	},
	{
		id: '3',
		vendorName: 'Vendor 3',
		balance: 100.0,
		imageUrl: 'https://picsum.photos/500/300?random=5'
	},
	{
		id: '4',
		vendorName: 'Vendor 4',
		balance: 50.0,
		imageUrl: 'https://picsum.photos/500/300?random=6'
	}
]

export default function WalletColumn() {
	return (
		<View style={styles.container}>
			<FlatList
				data={purchasedItems}
				style={styles.list}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => (
					<LargeWalletCard
						vendorName={item.vendorName}
						balance={item.balance}
						imageUrl={item.imageUrl}
					/>
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20
	},
	list: {
		width: 320,
		paddingHorizontal: 5 // Reduced padding to make the list wider
	}
})
