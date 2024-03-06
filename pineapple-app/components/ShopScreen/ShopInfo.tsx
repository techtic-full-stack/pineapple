import { View, Text } from 'react-native'
import React from 'react'
import { TShop } from '../../utils/types'

const ShopInfo = ({ shop }: { shop: TShop }) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginTop: 24
			}}
		>
			<View>
				<Text
					style={{
						fontSize: 24
					}}
				>
					Åpent nå
				</Text>
				<Text
					style={{
						fontWeight: '300'
					}}
				>
					til 20:00 i dag
				</Text>
			</View>
			<Text
				style={{
					maxWidth: '60%',
					fontWeight: '200'
				}}
			>
				{shop.description || 'Ingen beskrivelse tilgjengelig'}
			</Text>
		</View>
	)
}

export default ShopInfo
