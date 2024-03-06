import firestore from '@react-native-firebase/firestore'
import { TUserProfile } from '../types'

export async function getUserById(id: string): Promise<TUserProfile> {
	const userDoc = await firestore().collection('users').doc(id).get()

	if (!userDoc.exists) {
		throw new Error(`User with ID ${id} not found`)
	}

	return userDoc.data() as TUserProfile
}
