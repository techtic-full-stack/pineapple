import { router } from 'expo-router'
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native'
import { usePartyMode } from '../../utils/contexts/PartyModeContext'
import { useCart } from '../../utils/contexts/CartContext'
import { MaterialIcons } from '@expo/vector-icons'

const CheckoutButton = () => {
	const { isPartyMode, partyMembers } = usePartyMode()
	const { cartItems } = useCart()
	return (
		<TouchableOpacity style={styles.container} onPress={() => router.push('/shop/cart')}>
			<View>
				<Text style={{ color: 'white' }}>Min {isPartyMode ? 'gruppe ' : ''}bestilling</Text>
				<Text style={styles.amount}>
					🛒
					{cartItems.reduce((acc, item) => {
						return acc + 1 * item.price
					}, 0)}
					kr
				</Text>
			</View>
			<View>
				{isPartyMode && (
					<View style={{ flexDirection: 'row' }}>
						{partyMembers.slice(0, 3).map((member, index) => {
							return (
								<View key={index} style={{ flexDirection: 'row' }}>
									<Circle imageUrl={member?.image} status={member?.status} />
								</View>
							)
						})}
					</View>
				)}
			</View>
		</TouchableOpacity>
	)
}
export default CheckoutButton

const Circle = ({ imageUrl, status }: { imageUrl?: string; status: string }) => {
	return (
		<View style={styles.circle}>
			{imageUrl ? (
				<Image source={{ uri: imageUrl }} style={styles.circleImage} />
			) : (
				<MaterialIcons name="person-outline" size={24} color="grey" />
			)}
			<Text style={styles.emoji}>
				{status === 'ready' ? (
					<Text>✅</Text>
				) : status === 'not ready' ? (
					<Text>🧐</Text>
				) : (
					<Text>❓</Text>
				)}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		marginTop: 10,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		backgroundColor: '#0F161E',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexGrow: 0,
		flexShrink: 0
	},
	amount: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold'
	},
	circle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: -10
		// overflow: 'hidden'
	},
	circleImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
		borderWidth: 2.25,
		borderColor: 'white'
	},
	emoji: {
		position: 'absolute',
		bottom: -6
	}
})
