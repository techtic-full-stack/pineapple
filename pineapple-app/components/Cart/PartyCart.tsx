import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { usePartyMode } from '../../utils/contexts/PartyModeContext'
import * as Clipboard from 'expo-clipboard'
import { MaterialIcons } from '@expo/vector-icons'

export default function PartyCart() {
	const { partyMembers, partyCode } = usePartyMode()
	const maxCircles = 5

	const copyToClipboard = () => {
		Clipboard.setStringAsync(partyCode)
		Alert.alert('Copied', 'Party code copied to clipboard')
	}

	const shareParty = () => {
		Alert.alert('Share', 'Share party')
	}

	const renderCirclesWithDividers = () => {
		const elements = []

		for (let i = 0; i < maxCircles; i++) {
			elements.push(
				<Circle
					key={`circle-${i}`}
					imageUrl={partyMembers[i]?.image}
					status={partyMembers[i]?.status}
				/>
			)

			// Add divider after the circle, except after the last one
			if (i < maxCircles - 1) {
				elements.push(<Divider key={`divider-${i}`} />)
			}
		}

		return elements
	}

	return (
		<View>
			<Text style={styles.title}>Nåværende rabatt:</Text>
			<Text style={styles.desciption}>
				For hver person som legger inn bestillingen sin{' '}
				<Text style={styles.descriptionBold}>reduseres prisen med 5%</Text> for alle.
			</Text>
			<View style={styles.circleContainer}>{renderCirclesWithDividers()}</View>
			<View style={styles.percentageContainer}>
				<Text style={styles.percentageText}> </Text>
				<Text style={styles.percentageText}>5%</Text>
				<Text style={styles.percentageText}>10%</Text>
				<Text style={styles.percentageText}>15%</Text>
				<Text style={styles.percentageText}>20%</Text>
			</View>

			<View style={styles.codeSharingContainer}>
				<TouchableOpacity style={styles.codeContainer} onPress={copyToClipboard}>
					<Text style={styles.codeText}>{partyCode}</Text>
					<MaterialIcons name="content-copy" size={24} color="white" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.sharingButton} onPress={shareParty}>
					<Text style={styles.sharingButtonText}>Del</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

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

const Divider = () => {
	return <View style={styles.divider} />
}

const styles = StyleSheet.create({
	title: {
		fontSize: 23,
		marginTop: 24
	},
	desciption: {
		fontSize: 16,
		marginTop: 14
	},
	descriptionBold: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	codeSharingContainer: {
		flexDirection: 'row',
		width: '100%',
		marginTop: 24,
		paddingHorizontal: '10%',
		justifyContent: 'space-between'
	},
	codeContainer: {
		backgroundColor: '#242D42',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderRadius: 12
	},
	codeText: {
		fontSize: 20,
		color: 'white',
		fontWeight: '500',
		flexGrow: 1,
		marginRight: 10,
		textAlign: 'center',
		letterSpacing: 2
	},
	circleContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30,
		marginBottom: 10
	},
	circle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 5
	},
	circleImage: {
		width: 50,
		height: 50,
		borderRadius: 25
	},
	emoji: {
		position: 'absolute',
		bottom: -6
	},
	percentageContainer: {
		width: '100%',
		flexDirection: 'row',
		paddingLeft: 42
	},
	percentageText: {
		marginTop: 4,
		fontSize: 16,
		color: '#000',
		marginRight: 45
	},
	divider: {
		height: 2,
		width: 16,
		backgroundColor: '#273044',
		borderRadius: 100
	},
	sharingButton: {
		backgroundColor: '#7C818E',
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,

		justifyContent: 'center'
	},
	sharingButtonText: {
		color: 'white',
		fontSize: 20
	}
})
