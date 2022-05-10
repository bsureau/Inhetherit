import { createContext, useContext, useState } from 'react'

const HeirWillsContext = createContext([])

export function WillsProvider({ children }) {
  const [heirWills, setHeirWills] = useState([])
  return (
    <HeirWillsContext.Provider
      value={{
        heirWills,
        setHeirWills,
      }}
    >
      {children}
    </HeirWillsContext.Provider>
  )
}

export function useHeirWills() {
  const context = useContext(HeirWillsContext)

  if (!context) {
    throw new Error('useHeirWills must be used inside a `HeirWillsContext`')
  }

  return context
}
