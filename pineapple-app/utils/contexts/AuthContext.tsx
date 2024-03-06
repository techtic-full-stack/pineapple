import React, { createContext, useState, useEffect, ReactNode } from 'react'
import auth from '@react-native-firebase/auth'
import { TUserProfile } from '../types'
import { getUserById } from '../firebase/UserService'
import { signOut as authServiceSignOut } from '../firebase/AuthService'

type TAuthContextType = {
	user: TUserProfile | null
	isLoading: boolean
	error: Error | null
	signOut: () => Promise<void>
}

export const AuthContext = createContext<TAuthContextType>({
	user: null,
	isLoading: true,
	error: null,
	signOut: async () => {}
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<TUserProfile | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(async (authUser) => {
			try {
				if (authUser) {
					const firestoreUser = (await getUserById(authUser.uid)) as TUserProfile
					setUser(firestoreUser)
				} else {
					setUser(null)
				}
			} catch (err) {
				setError(err as Error)
			} finally {
				setIsLoading(false)
			}
		})
		return subscriber // Unsubscribe on unmount
	}, [])

	const signOut = async () => {
		try {
			await authServiceSignOut()
			setUser(null)
		} catch (err) {
			setError(err as Error)
		}
	}

	return (
		<AuthContext.Provider value={{ user, isLoading, error, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => React.useContext(AuthContext)
