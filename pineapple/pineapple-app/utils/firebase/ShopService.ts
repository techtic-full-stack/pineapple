import firestore from '@react-native-firebase/firestore'
import { TShop } from '../types'

export async function getAllShops(): Promise<TShop[]> {
	const querySnapshot = await firestore().collection('shops').get()
	const shops: TShop[] = []
	querySnapshot.forEach((doc) => {
		const data = doc.data() as TShop
		shops.push({
			...data,
			documentId: doc.id
		})
	})
	return shops
}

export async function getShopById(id: string): Promise<TShop> {
	const shop = await firestore().collection('shops').doc(id).get()
	return shop.data() as TShop
}
