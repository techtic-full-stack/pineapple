import { View, StyleSheet } from 'react-native'
import React from 'react'

export default function ModalLine() {
	return <View style={styles.modalLine} />
}

const styles = StyleSheet.create({
	modalLine: {
		width: 44,
		height: 4,
		borderRadius: 100,
		backgroundColor: '#E8E8E8',
		marginTop: 8
	}
})
