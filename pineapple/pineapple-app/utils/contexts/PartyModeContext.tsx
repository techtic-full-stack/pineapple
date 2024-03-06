import React, { createContext, useState, useContext, useMemo, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TPartyMember, TUserProfile } from '../types'
import { getPartyById, getPartyMembers } from '../firebase/PartyModeService'
import { getUserById } from '../firebase/UserService'

type TPartyModeContextType = {
	isPartyMode: boolean
	currentPartyId: string
	currentShopId: string
	partyCode: string
	partyAdmin: TUserProfile
	partyMembers: TPartyMember[]
	setPartyMode: (isActive: boolean) => void
	setCurrentPartyId: (partyId: string) => void
	setCurrentShopId: (shopId: string) => void
	setPartyCode: (partyCode: string) => void
	setPartyMembers: (partyMembers: TPartyMember[]) => void
	setPartyAdmin: (partyAdmin: TUserProfile) => void
}

const defaultPartyAdmin: TUserProfile = {
	id: '',
	name: '',
	image: '',
	email: '',
	phoneNumber: '',
	createdAt: '',
	lastSignedInAt: ''
}

export const PartyModeContext = createContext<TPartyModeContextType>({
	isPartyMode: false,
	currentPartyId: '',
	currentShopId: '',
	partyCode: '',
	partyAdmin: defaultPartyAdmin,
	partyMembers: [],
	setPartyMode: () => {},
	setCurrentPartyId: () => {},
	setCurrentShopId: () => {},
	setPartyCode: () => {},
	setPartyMembers: () => {},
	setPartyAdmin: () => {}
})

export const PartyModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isPartyMode, setIsPartyMode] = useState(false)
	const [currentPartyId, setCurrentPartyId] = useState('')
	const [currentShopId, setCurrentShopId] = useState('')

	const [partyMembers, setPartyMembers] = useState<TPartyMember[]>([])
	const [partyCode, setPartyCode] = useState('')
	const [partyAdmin, setPartyAdmin] = useState<TUserProfile>(defaultPartyAdmin)

	const setPartyMode = (isActive: boolean) => {
		setIsPartyMode(isActive)
		if (!isActive) {
			setCurrentPartyId('')
			setCurrentShopId('')
			setPartyMembers([])
			setPartyCode('')
			setPartyAdmin(defaultPartyAdmin)
		}
	}

	const fetchAndCachePartyData = async (partyId: string) => {
		try {
			const partyData = await getPartyById(partyId)
			if (!partyData) {
				throw new Error('Party not found')
			}

			const partyMembers = await getPartyMembers(partyId)
			const partyAdmin = await getUserById(partyData.adminId)

			const combinedPartyData = {
				...partyData,
				members: partyMembers,
				admin: partyAdmin
			}

			await AsyncStorage.setItem(`partyData_${partyId}`, JSON.stringify(combinedPartyData))

			setPartyMembers(partyMembers)
			setPartyCode(partyData.code)
			setPartyAdmin(partyAdmin)
		} catch (error) {
			console.error('Error fetching party data:', error)
		}
	}

	// Function to read party data from cache
	const readPartyDataFromCache = async (partyId: string) => {
		try {
			const cachedData = await AsyncStorage.getItem(`partyData_${partyId}`)
			if (cachedData) {
				const partyData = JSON.parse(cachedData)
				setPartyMembers(partyData.members)
				setPartyCode(partyData.code)
				setPartyAdmin(partyData.admin)
			} else {
				fetchAndCachePartyData(partyId)
			}
		} catch (error) {
			console.error('Error reading party data from cache:', error)
		}
	}

	useEffect(() => {
		if (currentPartyId) {
			readPartyDataFromCache(currentPartyId)
		}
	}, [currentPartyId])

	const contextValue = useMemo(
		() => ({
			isPartyMode,
			currentPartyId,
			currentShopId,
			partyCode,
			partyMembers,
			partyAdmin,
			setPartyMode,
			setCurrentPartyId,
			setCurrentShopId,
			setPartyCode,
			setPartyMembers,
			setPartyAdmin
		}),
		[isPartyMode, currentPartyId, currentShopId, partyMembers, partyCode, partyAdmin]
	)

	return <PartyModeContext.Provider value={contextValue}>{children}</PartyModeContext.Provider>
}

// Custom hook to use the party mode context
export const usePartyMode = () => useContext(PartyModeContext)
