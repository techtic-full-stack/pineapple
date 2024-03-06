import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import ShopsList from '../../components/HomeScreen/ShopsList'
import { TShop } from '../../utils/types'
import { getAllShops } from '../../utils/firebase/ShopService'
import JoinPartyBanner from '../../components/HomeScreen/JoinPartyBanner'
import HomeHeader from '../../components/HomeScreen/HomeHeader'

export default function HomeScreen() {
	const [loading, setLoading] = useState(true)
	const [shops, setShops] = useState<TShop[]>([])
	const [error, setError] = useState<Error>()

	useEffect(() => {
		const fetchShops = async () => {
			try {
				const fetchedShops = await getAllShops()
				setShops(fetchedShops)
			} catch (error) {
				setError(error as Error)
			} finally {
				setLoading(false)
			}
		}

		fetchShops()
	}, [])

	if (error) {
		return (
			<View>
				<Text>{error.message}</Text>
			</View>
		)
	}

	if (loading) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<HomeHeader />
			<JoinPartyBanner />
			<ShopsList shops={shops} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFF',
		paddingTop: 60
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%'
	}
})
