import { Button, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../utils/contexts/AuthContext'

export default function ModalScreen() {
	const { user, signOut } = useAuth()

	const handleDeleteAccount = () => {}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Modal example for profile</Text>
			<View style={styles.separator} />
			<Text>Hi {user?.name}!</Text>
			<Text>Also, the user will be able to see their current balance</Text>
			<Button title="Sign out" onPress={signOut} />
			<Button title="Delete Account" onPress={handleDeleteAccount} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
		backgroundColor: '#c5c5c5'
	}
})
