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
    throw new Error('useWill must be used inside a `WillContext`')
  }

  return context
}