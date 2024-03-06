import firestore from '@react-native-firebase/firestore'
import { TPartyMember, TParty, TCartItem } from '../types'
import { getUserById } from './UserService'

const partiesRef = firestore().collection('parties')

/**
 * @param {string} adminId - The ID of the admin user.
 * @param {string} shopId - The ID of the shop associated with the party.
 * @returns {Promise<string>} The ID of the newly created party document.
 * @throws Will throw an error if the Firestore operation fails.
 */
export async function createNewParty(adminId: string, shopId: string): Promise<string> {
	try {
		const currentTime = new Date()
		const timeLimit = new Date(currentTime.getTime() + 10 * 60000) // 10 minutes from now

		const partyRef = await partiesRef.add({
			adminId,
			shopId,
			memberIds: [adminId], // memberIds makes it easier to query for parties that a user is a member of
			status: 'open',
			discountRate: 0,
			grossTotal: 0, // total amount before discount
			netTotal: 0, // total amount after discount
			createdAt: currentTime.toISOString(),
			timeLimit: timeLimit.toISOString()
		})

		await partyRef
			.collection('members')
			.doc(adminId)
			.set({
				id: adminId,
				status: 'not ready',
				grossAmount: 0, // total amount before discount for this member
				orderDetails: { items: [], notes: '' }
			})
		return partyRef.id
	} catch (error) {
		console.error('Error creating party: ', error)
		throw error
	}
}

export async function closeParty(partyId: string) {
	try {
		await partiesRef.doc(partyId).update({ status: 'closed' })
	} catch (error) {
		console.log('Error closing party: ', error)
	}
}

/**
 * @param {string} partyCode - The party code.
 * @param {string} userId - The ID of the user attempting to join the party.
 * @returns {Promise<TParty>} - A promise that resolves to the updated party data.
 * @throws {Error} - Throws an error if the party does not exist or the user is already a member.
 */
export async function joinParty(partyCode: string, userId: string): Promise<TParty> {
	try {
		const partyQuerySnapshot = await partiesRef.where('code', '==', partyCode).limit(1).get()

		if (partyQuerySnapshot.empty) {
			throw new Error('Party does not exist')
		}

		const partyDocRef = partyQuerySnapshot.docs[0].ref
		const membersRef = partyDocRef.collection('members')
		const memberDoc = await membersRef.doc(userId).get()

		if (memberDoc.exists) {
			throw new Error('User is already a member of this party')
		}

		await membersRef.doc(userId).set({
			id: userId,
			status: 'not ready',
			grossAmount: 0,
			orderDetails: { items: [], notes: '' }
		})

		await partyDocRef.update({
			memberIds: firestore.FieldValue.arrayUnion(userId)
		})
		const party = await partyDocRef.get()
		return { id: party.id, ...party.data() } as TParty
	} catch (error) {
		console.error('Error joining party:', error)
		throw error
	}
}

/**
 * @param {string} userId - The ID of the user whose party memberships are to be retrieved.
 * @returns {Promise<TParty[]>} - A promise that resolves to an array of party objects.
 * @throws {Error} - Throws an error if the query fails.
 */
export async function getPartiesByUserId(userId: string): Promise<TParty[]> {
	try {
		const parties = await partiesRef.where('memberIds', 'array-contains', userId).get()
		return parties.docs
			.map((doc) => ({ id: doc.id, ...doc.data() } as TParty))
			.filter((party) => party.status === 'open')
	} catch (error) {
		console.error('Error getting parties by user id:', error)
		throw error
	}
}
export async function getPartyById(partyId: string) {
	try {
		const party = await partiesRef.doc(partyId).get()
		if (!party.exists) {
			throw new Error('Party not found')
		}
		return { id: party.id, ...party.data() } as TParty
	} catch (error) {
		console.log('Error getting party by id: ', error)
	}
}

export async function getPartyByAdminId(adminId: string) {
	try {
		const party = await partiesRef
			.where('adminId', '==', adminId)
			.where('status', '==', 'open')
			.limit(1)
			.get()

		if (!party.empty) {
			const partyData = party.docs[0].data()
			return { id: party.docs[0].id, ...partyData } as TParty
		} else {
			throw new Error('No open party found for the admin')
		}
	} catch (error) {
		console.log('Error getting party by admin id: ', error)
	}
}

/**
 * @param {string} partyId - The ID of the party whose members are to be retrieved.
 * @returns {Promise<TPartyMember[]>} - A promise that resolves to an array of party member objects.
 * @throws {Error} - Throws an error if fetching party members fails.
 */
export async function getPartyMembers(partyId: string): Promise<TPartyMember[]> {
	try {
		const membersSnapshot = await partiesRef.doc(partyId).collection('members').get()
		const membersProfilePromises = membersSnapshot.docs.map((doc) => getUserById(doc.id))
		const membersProfiles = await Promise.all(membersProfilePromises)
		const members = membersSnapshot.docs.map((doc, index) => ({
			...doc.data(),
			...membersProfiles[index]
		}))
		return members as unknown as TPartyMember[]
	} catch (error) {
		console.error('Error fetching party members:', error)
		throw error
	}
}

export async function updatePartyMemberStatus(partyId: string, userId: string, status: string) {
	try {
		await partiesRef.doc(partyId).collection('members').doc(userId).update({ status })
	} catch (error) {
		console.log('Error updating party member status: ', error)
	}
}

export async function updatePartyMemberOrderDetails(
	partyId: string,
	userId: string,
	orderDetails: TCartItem[],
	grossAmount: number,
	sessionId: string,
	paymentIntent: string
) {
	try {
		await partiesRef
			.doc(partyId)
			.collection('members')
			.doc(userId)
			.update({ orderDetails, grossAmount, sessionId, paymentIntent })
		await partiesRef.doc(partyId).update({
			grossTotal: firestore.FieldValue.increment(grossAmount)
		})
	} catch (error) {
		console.log('Error updating party member order details: ', error)
	}
}

export async function leaveParty(partyId: string, userId: string) {
	try {
		await partiesRef.doc(partyId).collection('members').doc(userId).delete()
		await partiesRef.doc(partyId).update({
			memberIds: firestore.FieldValue.arrayRemove(userId)
		})
	} catch (error) {
		console.log('Error leaving party: ', error)
	}
}
