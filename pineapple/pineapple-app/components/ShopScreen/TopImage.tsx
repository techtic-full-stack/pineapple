import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TShop } from '../../utils/types'

const TopImage = ({ shop }: { shop: TShop }) => {
	return (
		<View style={styles.imageContainer}>
			<Image source={{ uri: shop.image }} style={{ width: '100%', height: '100%' }} />
			<View style={styles.imageOverlay}></View>
		</View>
	)
}

const styles = StyleSheet.create({
	imageContainer: {
		position: 'relative',
		height: 170
	},
	imageOverlay: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		padding: 20,
		justifyContent: 'flex-end',
		alignItems: 'flex-start'
	}
})

export default TopImage
