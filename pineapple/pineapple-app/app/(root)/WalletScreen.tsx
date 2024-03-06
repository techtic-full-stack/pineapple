import React from 'react'
import { StyleSheet, View } from 'react-native'
import WalletColumn from '../../components/Colums/WalletColumn'

export default function WalletScreen() {
	return (
		<View style={styles.container}>
			<WalletColumn />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F1F5F9'
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
