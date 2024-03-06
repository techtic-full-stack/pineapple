import { View } from 'react-native'
import React from 'react'

export default function ModalMainContent({ children }: { children: React.ReactNode }) {
	return (
		<View
			style={{
				width: '90%',
				flexGrow: 1
			}}
		>
			{children}
		</View>
	)
}
