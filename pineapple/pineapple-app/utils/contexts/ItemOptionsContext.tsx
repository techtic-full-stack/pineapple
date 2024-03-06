import React, { createContext, useState, useContext, useMemo } from 'react'
import { TMenuItem } from '../types'

type TOptionsContextType = {
	selectedItem: TMenuItem | null
	selectItem: (item: TMenuItem) => void
	clearSelectedItem: () => void
}

export const OptionsContext = createContext<TOptionsContextType>({
	selectedItem: null,
	selectItem: () => {},
	clearSelectedItem: () => {}
})

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [selectedItem, setSelectedItem] = useState<TMenuItem | null>(null)

	const selectItem = (item: TMenuItem) => {
		setSelectedItem(item)
	}

	const clearSelectedItem = () => {
		setSelectedItem(null)
	}

	const contextValue = useMemo(
		() => ({
			selectedItem,
			selectItem,
			clearSelectedItem
		}),
		[selectedItem]
	)

	return <OptionsContext.Provider value={contextValue}>{children}</OptionsContext.Provider>
}

export const useOptions = () => useContext(OptionsContext)
