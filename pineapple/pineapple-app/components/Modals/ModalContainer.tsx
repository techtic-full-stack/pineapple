import { View } from 'react-native'
import React from 'react'

export default function ModalContainer({ children }: { children: React.ReactNode }) {
	return <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>{children}</View>
}
