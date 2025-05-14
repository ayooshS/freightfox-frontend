// src/context/HeaderActionContext.tsx
import { createContext, useContext, useState, ReactNode } from "react"
import type { ReactElement } from "react"

type HeaderActionContextType = {
	setAction: (node: ReactElement | null) => void
	action: ReactElement | null
}

const HeaderActionContext = createContext<HeaderActionContextType | undefined>(undefined)

export const useHeaderAction = () => {
	const ctx = useContext(HeaderActionContext)
	if (!ctx) throw new Error("useHeaderAction must be used within HeaderActionProvider")
	return ctx
}

export const HeaderActionProvider = ({ children }: { children: ReactNode }) => {
	const [action, setAction] = useState<ReactElement | null>(null)

	return (
		<HeaderActionContext.Provider value={{ setAction, action }}>
			{children}
		</HeaderActionContext.Provider>
	)
}
