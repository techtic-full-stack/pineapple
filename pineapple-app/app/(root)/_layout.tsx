import { Tabs } from 'expo-router'
import { Image } from 'react-native'

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
// function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
// 	return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />
// }

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerTitleAlign: 'left',
				headerTitleStyle: {
					fontSize: 24
				},
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: '#FFF',
					borderTopColor: '#FFF'
				}
			}}
		>
			<Tabs.Screen
				name="feed"
				options={{
					title: 'Feed 🧾',
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Image
								source={require('../../assets/icons/Gift.png')}
								style={{ width: 24, height: 24 }}
							/>
						) : (
							<Image
								source={require('../../assets/icons/GiftOutline.png')}
								style={{ width: 24, height: 24 }}
							/>
						)
				}}
			/>
			<Tabs.Screen
				name="index"
				options={{
					title: 'pineapple 🍍',
					headerShown: false,
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Image
								source={require('../../assets/icons/Home.png')}
								style={{ width: 24, height: 24 }}
							/>
						) : (
							<Image
								source={require('../../assets/icons/HomeOutline.png')}
								style={{ width: 24, height: 24 }}
							/>
						),
					tabBarLabel: 'Home'
				}}
			/>
			<Tabs.Screen
				name="WalletScreen"
				options={{
					title: 'Wallet 💵',
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Image
								source={require('../../assets/icons/CreditCard.png')}
								style={{ width: 24, height: 24 }}
							/>
						) : (
							<Image
								source={require('../../assets/icons/CreditCardOutline.png')}
								style={{ width: 24, height: 24 }}
							/>
						)
				}}
			/>

			<Tabs.Screen
				name="shop"
				options={{
					headerShown: false,
					href: null, // Remove from tab bar
					tabBarStyle: {
						display: 'none'
					}
				}}
			/>
		</Tabs>
	)
}
