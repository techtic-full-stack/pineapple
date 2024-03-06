import { useEffect, useState, useContext } from 'react'
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native'
import { TParty } from '../../utils/types'
import { router } from 'expo-router'
import { getShopById } from '../../utils/firebase/ShopService'
import { getUserById } from '../../utils/firebase/UserService'
import { PartyModeContext } from '../../utils/contexts/PartyModeContext'

export default function MediumPartyCard({ party }: { party: TParty }) {
	const [adminName, setAdminName] = useState('')
	const [shopName, setShopName] = useState('')
	const [shopImage, setShopImage] = useState('')
	const { setPartyMode, setCurrentPartyId, setCurrentShopId } = useContext(PartyModeContext)

	useEffect(() => {
		const fetchPartyDetails = async () => {
			try {
				const admin = await getUserById(party.adminId)
				setAdminName(admin?.name || 'Unknown')

				const shop = await getShopById(party.shopId)
				setShopName(shop?.name || 'Unknown')
				setShopImage(shop?.image || '')
			} catch (error) {
				console.error('Error fetching party details:', error)
			}
		}

		fetchPartyDetails()
	}, [party.adminId, party.shopId])

	const handleClick = () => {
		setCurrentPartyId(party.id)
		setCurrentShopId(party.shopId)
		setPartyMode(true)
		router.push({
			pathname: '/(root)/shop/[id]',
			params: { id: party.shopId }
		})
	}

	return (
		<TouchableOpacity onPress={handleClick}>
			<View style={styles.card}>
				<Image
					source={{ uri: shopImage || 'https://picsum.photos/200/200' }}
					style={styles.image}
				/>
				<View style={styles.textContainer}>
					<Text style={styles.name}>Party at {shopName}</Text>
					<Text style={styles.address}>Made by {adminName} 🎉</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'white',
		borderRadius: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginVertical: 8,
		marginHorizontal: 16,
		overflow: 'hidden',
		width: 240,
		height: 240
	},
	image: {
		width: '100%',
		height: 150,
		resizeMode: 'cover'
	},
	textContainer: {
		padding: 16,
		height: 90
	},
	name: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	address: {
		fontSize: 14,
		color: 'grey'
	}
})
