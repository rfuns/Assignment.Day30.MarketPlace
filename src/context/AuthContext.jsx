import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, tokenStore } from '../api/client'

const AuthContext = createContext(null)
const USER_KEY = 'marketplace_user'

const readUser = () => {
  try {
    return tokenStore.get() ? JSON.parse(localStorage.getItem(USER_KEY)) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const persist = useCallback((data) => {
    tokenStore.set(data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const login = useCallback(async (credentials) => persist(await api.login(credentials)), [persist])
  const register = useCallback(async (payload) => persist(await api.register(payload)), [persist])

  const logout = useCallback(() => {
    tokenStore.clear()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  // Token kedaluwarsa/tidak valid -> keluar otomatis
  useEffect(() => {
    if (!user) return
    api.getUser(user.id).catch((e) => e.status === 401 && logout())
  }, [user, logout])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isSeller: user?.role === 'seller', login, register, logout }),
    [user, login, register, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
