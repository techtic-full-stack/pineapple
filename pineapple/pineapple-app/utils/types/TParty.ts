import { Timestamp } from '@google-cloud/firestore'
import { TMenuItem } from './TShop'

export type TPartyMember = {
	id: string
	name: string
	image: string
	email: string
	phoneNumber: string
	status: 'not ready' | 'ready' | 'left party'
	grossAmount: number
	orderDetails: {
		items: Array<TMenuItem>
		notes: string
	}
}

export type TParty = {
	id: string
	adminId: string
	code: string
	shopId: string
	memberIds: Array<string>
	status: 'open' | 'closed' | 'paid'
	discountRate: number
	grossTotal: number
	netTotal: number
	createdAt: Timestamp
	timeLimit: Timestamp
}
