"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/types'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  clinicId?: string
  clinicIds?: string[]
}

interface SessionContextType {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  login: (user: User) => void
  logout: () => void
  refresh: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  status: 'loading',
  login: () => {},
  logout: () => {},
  refresh: async () => {},
})

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
  const router = useRouter()

  // Initialize session from localStorage on client side
  useEffect(() => {
    const savedUser = localStorage.getItem('digigo_user')
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setStatus('authenticated')
      } catch (error) {
        console.error('Error parsing saved user:', error)
        setStatus('unauthenticated')
        localStorage.removeItem('digigo_user')
      }
    } else {
      // Check if we have a session on the server
      fetchCurrentUser()
    }
  }, [])

  // Fetch current user from the server
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.success && data.user) {
          setUser(data.user)
          setStatus('authenticated')
          localStorage.setItem('digigo_user', JSON.stringify(data.user))
        } else {
          setStatus('unauthenticated')
          localStorage.removeItem('digigo_user')
        }
      } else {
        setStatus('unauthenticated')
        localStorage.removeItem('digigo_user')
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
      setStatus('unauthenticated')
      localStorage.removeItem('digigo_user')
    }
  }

  const login = (user: User) => {
    setUser(user)
    setStatus('authenticated')
    localStorage.setItem('digigo_user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    setStatus('unauthenticated')
    localStorage.removeItem('digigo_user')
    localStorage.removeItem('digigo_email')
    localStorage.removeItem('digigo_role')
    router.push('/login')
  }

  const refresh = async () => {
    await fetchCurrentUser()
  }

  return (
    <SessionContext.Provider value={{ user, status, login, logout, refresh }}>
      {children}
    </SessionContext.Provider>
  )
}