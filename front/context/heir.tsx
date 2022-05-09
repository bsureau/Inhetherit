import { createContext, useContext, useState } from 'react'

const HeirContext = createContext(undefined)

export function HeirProvider({ children }) {
  const [heir, setHeir] = useState({})
  return (
    <HeirContext.Provider
      value={{
          heir,
          setHeir,
      }}
    >
      {children}
    </HeirContext.Provider>
  )
}

export function useHeir() {
  const context = useContext(HeirContext)

  if (!context) {
    throw new Error('useHeir must be used inside a `useHeir`')
  }

  return context
}
