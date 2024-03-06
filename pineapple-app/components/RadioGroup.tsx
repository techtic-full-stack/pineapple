import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { TOption } from '../utils/types'

type RadioGroupProps = {
	options: TOption[]
	selectedValue: string
	onSelect: (value: string) => void
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onSelect }) => {
	return (
		<View style={styles.container}>
			{options.map((option) => (
				<TouchableOpacity key={option.id} style={styles.option} onPress={() => onSelect(option.id)}>
					<View style={styles.radioButtonContainer}>
						<View
							style={[
								styles.radioButton,
								selectedValue === option.id && styles.radioButtonSelected
							]}
						/>
					</View>
					<View style={styles.radioLabel}>
						<Text style={styles.radioTitle}>{option.name}</Text>
						<Text>+ kr {option.price.toFixed(2)}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		// ... existing styles
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		marginTop: 5
	},
	radioButtonContainer: {
		marginRight: 10
	},
	radioButton: {
		height: 16,
		width: 16,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: '#000',
		alignItems: 'center',
		justifyContent: 'center'
	},
	radioButtonSelected: {
		height: 16,
		width: 16,
		borderRadius: 50,
		backgroundColor: '#000'
	},
	radioLabel: {
		width: '90%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	radioTitle: {
		fontSize: 16
	}
})

export default RadioGroup
