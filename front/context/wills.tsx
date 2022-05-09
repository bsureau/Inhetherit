import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

const WillsContext = createContext([])

export function WillsProvider({ children }) {
  const [wills, setWills] = useState([])
  return (
    <WillsContext.Provider
      value={{
        wills,
        setWills,
      }}
    >
      {children}
    </WillsContext.Provider>
  )
}

export function useWills() {
  const context = useContext(WillsContext)

  if (!context) {
    throw new Error('useWills must be used inside a `WillsContext`')
  }

  return context
}
