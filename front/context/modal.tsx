import { createContext, useContext, useState } from 'react'

const ModalContext = createContext(undefined);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    open: undefined,
    data: {}
  })

  return (
    <ModalContext.Provider
      value={{
        modal,
        setModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used inside a `ModalContext`')
  }

  return context
}