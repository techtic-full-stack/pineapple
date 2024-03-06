import { Text, TouchableOpacity, StyleSheet, Alert, View, ActivityIndicator } from 'react-native'
import { usePartyMode } from '../../../../utils/contexts/PartyModeContext'
import { MaterialIcons } from '@expo/vector-icons'
import { Redirect, router } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import ModalContainer from '../../../../components/Modals/ModalContainer'
import ModalHeader from '../../../../components/Modals/ModalHeader'
import ModalMainContent from '../../../../components/Modals/ModalMainContent'
import { useEffect } from 'react'
import { firebase } from '@react-native-firebase/firestore'

export default function PartyCodeScreen() {
	const { isPartyMode, currentPartyId, currentShopId, partyCode, setPartyCode } = usePartyMode()

	const copyToClipboard = () => {
		if (partyCode) {
			Clipboard.setStringAsync(partyCode)
			Alert.alert('Copied', 'Party code copied to clipboard')
		}
	}
	useEffect(() => {
		if (currentPartyId) {
			const unsubscribe = firebase
				.firestore()
				.collection('parties')
				.doc(currentPartyId)
				.onSnapshot(
					(doc) => {
						const partyData = doc.data()
						if (partyData && partyData.code) {
							setPartyCode(partyData.code)
						}
					},
					(err) => {
						console.error('Error listening to party changes:', err)
					}
				)

			return () => unsubscribe()
		}
	}, [currentPartyId, setPartyCode])

	if (!isPartyMode) {
		return <Redirect href="/" />
	}

	return (
		<ModalContainer>
			<ModalHeader title="Gruppekjøp 2/2" />
			<ModalMainContent>
				<Text style={styles.headerText}>Gruppekjøp</Text>
				<Text style={styles.subText}>
					Alle betaler hver for seg selv, men du som gruppeleder bekrefter gruppebestillingen når
					alle er ferdig.
				</Text>
				<Text style={styles.headerText}>Inviter vennene dine</Text>
				<Text style={styles.subText}>
					Du kan nå starte å invitere vennene dine ved å gi dem denne koden.
				</Text>

				<TouchableOpacity style={styles.codeContainer} onPress={copyToClipboard}>
					{!partyCode ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Text style={styles.codeText}>{partyCode}</Text>
					)}
					<MaterialIcons name="content-copy" size={24} color="white" />
				</TouchableOpacity>

				<Text style={styles.hintText}>Klikk her for å dele koden</Text>
			</ModalMainContent>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() =>
						router.push({ pathname: '/(root)/shop/[id]', params: { id: currentShopId } })
					}
				>
					<Text style={styles.buttonText}>Start nå</Text>
				</TouchableOpacity>
			</View>
		</ModalContainer>
	)
}

const styles = StyleSheet.create({
	headerText: {
		marginTop: 24,
		fontSize: 24
	},
	subText: {
		marginTop: 24,
		fontSize: 16
	},
	codeContainer: {
		backgroundColor: '#242D42',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderRadius: 12,
		marginTop: 24
	},
	codeText: {
		fontSize: 20,
		color: 'white',
		fontWeight: '500',
		letterSpacing: 2,
		flexGrow: 1,
		marginRight: 10,
		textAlign: 'center'
	},
	hintText: {
		fontSize: 16,
		marginTop: 16,
		textAlign: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		borderTopColor: '#E8E8E8',
		borderTopWidth: 1,
		width: '100%',
		padding: 16,
		marginBottom: 24,
		flexGrow: 0,
		flexShrink: 0
	},
	button: {
		backgroundColor: '#0F161E',
		paddingHorizontal: 24,
		paddingVertical: 16,
		borderRadius: 12
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	}
})
