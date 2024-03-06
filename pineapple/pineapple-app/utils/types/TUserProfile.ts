export type TUserProfile = {
	id: string
	email: string | null
	name: string | null
	image: string | null
	phoneNumber: string | null
	createdAt: string
	lastSignedInAt: string
	stripeId?: string
	stripeLink?: string
}
