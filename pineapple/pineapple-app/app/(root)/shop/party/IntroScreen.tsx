import { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { createNewParty } from '../../../../utils/firebase/PartyModeService'
import { usePartyMode } from '../../../../utils/contexts/PartyModeContext'
import { router, useLocalSearchParams } from 'expo-router'
import { firebase } from '@react-native-firebase/auth'
import ModalHeader from '../../../../components/Modals/ModalHeader'
import ModalContainer from '../../../../components/Modals/ModalContainer'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function IntroScreen() {
	const { setPartyMode, setCurrentPartyId, setCurrentShopId } = usePartyMode()
	const { shopId } = useLocalSearchParams<{ shopId: string }>()
	const [isLoading, setIsLoading] = useState(false)

	const startPartyMode = async () => {
		setIsLoading(true)
		const currentUserId = firebase.auth().currentUser?.uid
		if (currentUserId) {
			try {
				const partyId = await createNewParty(currentUserId, shopId)
				if (partyId) {
					setCurrentPartyId(partyId)
					setCurrentShopId(shopId)
					setPartyMode(true)
					router.replace('/shop/party/PartyCodeScreen')
				} else {
					console.error('Error creating party')
				}
			} catch (error) {
				console.error('Error starting party mode:', error)
			} finally {
				setIsLoading(false)
			}
		}
	}

	return (
		<ModalContainer>
			<ModalHeader title="Gruppekjøp 1/2" />
			<View style={styles.mainContent}>
				<Text style={styles.title}>Hvordan fungerer det?</Text>
				<Text style={styles.description}>
					Kjøp som en vennegjeng og spar penger.{'\n'}Flere venner = Større rabatter 🥳
				</Text>
				<View style={{ height: 24 }} />
				<View style={styles.itemContainer}>
					<MaterialCommunityIcons name="share-variant-outline" size={24} color="black" />
					<View style={styles.itemText}>
						<Text style={styles.itemTitle}>Legg til venner</Text>
						<Text style={styles.itemDescription}>
							Når du lager et gruppekjøp får du en kode du kan dele til vennene dine for å legge dem
							til.
						</Text>
					</View>
				</View>

				<View style={styles.itemContainer}>
					<Image
						source={require('../../../../assets/icons/CreditCardOutline.png')}
						style={{ width: 24, height: 24 }}
					/>
					<View style={styles.itemText}>
						<Text style={styles.itemTitle}>Betal hver for dere</Text>
						<Text style={styles.itemDescription}>
							Når du lager et gruppekjøp får du en kode du kan dele til vennene dine for å legge dem
							til.
						</Text>
					</View>
				</View>

				<View style={styles.itemContainer}>
					<Image
						source={require('../../../../assets/icons/GiftOutline.png')}
						style={{ width: 24, height: 24 }}
					/>
					<View style={styles.itemText}>
						<Text style={styles.itemTitle}>Gruppeleder legger inn bestillingen</Text>
						<Text style={styles.itemDescription}>
							Når du lager et gruppekjøp får du en kode du kan dele til vennene dine for å legge dem
							til.
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.buttonGroup}>
				<TouchableOpacity onPress={() => {}} style={styles.cancelButton}>
					<Text style={styles.cancelButtonText}>Kanseller</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => startPartyMode()} style={styles.mainButton}>
					{isLoading ? (
						<ActivityIndicator size="small" color="#fff" />
					) : (
						<Text style={styles.mainButtonText}>Start Party Mode</Text>
					)}
				</TouchableOpacity>
			</View>
		</ModalContainer>
	)
}

const styles = StyleSheet.create({
	mainContent: {
		width: '90%',
		flexGrow: 1
	},
	title: {
		fontSize: 24,
		marginTop: 24
	},
	description: {
		fontSize: 16,
		marginTop: 14
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 24
	},
	itemText: {
		marginLeft: 24
	},
	itemTitle: {
		fontSize: 16
	},
	itemDescription: {
		marginTop: 4,
		fontSize: 14,
		fontWeight: '300'
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
	},
	cancelButton: {
		paddingHorizontal: 24,
		paddingVertical: 16
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600'
	},
	mainButton: {
		backgroundColor: '#0F161E',
		paddingHorizontal: 24,
		paddingVertical: 16,
		borderRadius: 12
	},
	mainButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	}
})
