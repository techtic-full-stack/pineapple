import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ModalLine from './ModalLine'

type ModalHeaderProps = {
	title: string
	divider?: boolean
}

export default function ModalHeader({ title, divider = true }: ModalHeaderProps) {
	return (
		<View style={styles.container}>
			<ModalLine />
			<Text style={styles.title}>{title}</Text>
			{divider && <View style={styles.divider} />}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: 'transparent',
		width: '100%'
	},
	title: {
		fontSize: 14,
		fontWeight: '500',
		marginTop: 24,
		marginBottom: 10
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: '#DEDEDE'
	}
})
