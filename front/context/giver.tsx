import { createContext, useContext, useState } from 'react'

const GiverContext = createContext(undefined)

export function GiverProvider({ children }) {
  const [giver, setGiver] = useState({})
  return (
    <GiverContext.Provider
      value={{
          giver,
          setGiver,
      }}
    >
      {children}
    </GiverContext.Provider>
  )
}

export function useGiver() {
  const context = useContext(GiverContext)

  if (!context) {
    throw new Error('useGiver must be used inside a `GiverContext`')
  }

  return context
}
