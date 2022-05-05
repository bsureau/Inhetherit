import { createContext, useContext, useState } from 'react'

const WillContext = createContext(undefined)

export function WillProvider({ children }) {
  const [will, setWill] = useState(undefined)
  return (
    <WillContext.Provider
      value={{
        will,
        setWill,
      }}
    >
      {children}
    </WillContext.Provider>
  )
}

export function useWill() {
  const context = useContext(WillContext)

  if (!context) {
    throw new Error('useUser must be used inside a `UserContext`')
  }

  return context
}