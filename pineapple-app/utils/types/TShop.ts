export type TOption = {
	id: string
	name: string
	price: number
	description: string
}

type TOptionCategory = {
	id: string
	name: string
	description: string
	options: Array<TOption>
}

export type TMenuItem = {
	id: string
	name: string
	price: number
	description: string | null
	image: string | null
	optionCategories: TOptionCategory[]
}

type TContactInfo = {
	phoneNumber: string
	email: string
}

export type TShop = {
	documentId: string
	name: string
	address: string
	location: string
	image: string
	menu: Array<TMenuItem>
	description: string
	category: string
	contactInfo: TContactInfo
	stripeConnectId: string
	stripeConnectLink: string
}
