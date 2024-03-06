import React, { createContext, useState, useContext, useMemo } from 'react'
import { TCartItem } from '../types'

type TCartContextType = {
	shopId: string
	cartItems: TCartItem[]
	totalAmount: number
	addToCart: (item: TCartItem) => void
	removeFromCart: (index: number) => void
	clearCart: () => void
	setShopId: (id: string) => void
}

// Create the context
export const CartContext = createContext<TCartContextType>({
	shopId: '',
	cartItems: [],
	totalAmount: 0,
	addToCart: () => {},
	removeFromCart: () => {},
	clearCart: () => {},
	setShopId: () => {}
})

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [cartItems, setCartItems] = useState<TCartItem[]>([])
	const [shopId, setShopId] = useState('')

	const addToCart = (item: TCartItem) => {
		setCartItems([...cartItems, item])
	}

	const removeFromCart = (index: number) => {
		setCartItems(cartItems.filter((item, idx) => idx !== index))
	}

	const clearCart = () => {
		setCartItems([])
	}

	const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0)

	const contextValue = useMemo(
		() => ({
			cartItems,
			shopId,
			totalAmount,
			setShopId,
			addToCart,
			removeFromCart,
			clearCart
		}),
		[cartItems]
	)

	return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)
