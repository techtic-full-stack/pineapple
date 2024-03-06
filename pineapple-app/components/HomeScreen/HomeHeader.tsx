import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useAuth } from '../../utils/contexts/AuthContext'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '../../utils/constants/Colors'

export default function HomeHeader() {
	const { user } = useAuth()

	function UserIcon({ pressed }: { pressed: boolean }) {
		if (user?.image) {
			return (
				<Image
					source={{ uri: user.image }}
					style={{
						width: 36.16,
						height: 36.16,
						borderRadius: 100,
						borderWidth: pressed ? 2 : 0,
						borderColor: Colors.light.tint
					}}
				/>
			)
		}
		return (
			<FontAwesome
				name="user-circle"
				size={32}
				style={{
					marginRight: 16,
					color: pressed ? Colors.light.tint : Colors.light.tabIconDefault
				}}
			/>
		)
	}

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.welcomeText}>Velkommen</Text>
				<Text style={styles.welcomeName}>{user?.name || '🍍'}</Text>
			</View>
			<View>
				<Link href="/modal" asChild>
					<Pressable>{({ pressed }) => <UserIcon pressed={pressed} />}</Pressable>
				</Link>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '90%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	welcomeText: {
		fontSize: 15.31,
		color: '#4F5663'
	},
	welcomeName: {
		fontSize: 19.13,
		color: '#061023',
		fontWeight: '500'
	}
})
