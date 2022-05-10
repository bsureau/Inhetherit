import { createContext, useContext, useState } from 'react'

const UserContext = createContext(undefined)

export function UserProvider({ children }) {
  const [user, setUser] = useState({})
  return (
    <UserContext.Provider
      value={{
          user,
          setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used inside a `UserContext`')
  }

  return context
}
