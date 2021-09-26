import Router from 'next/router'
import { setCookie } from 'nookies'
import { createContext, useState } from 'react'
import { api } from '../services/api'

type SignInCredentials = {
  username: string
  password: string
}

interface ProviderProps {
  children: React.ReactNode
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void> 
  isAuthenticated: boolean
  hasError: boolean
}


export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: ProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasError, setHasError] = useState(false)



  async function signIn(credentials: SignInCredentials) {
    function handleError(){
      setHasError(true)
      setInterval(() => {
        setHasError(false)
      }, 3000)
    }

    try {
      const response = await api.post('/token/', credentials)
      const { access, refresh} = response.data

      setCookie(null, 'access', access, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })

      setCookie(null, 'refresh', refresh, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })

      api.defaults.headers.Authorization = `Bearer ${access}`

      setIsAuthenticated(true)
      setHasError(false)

      Router.push('/characters')
    } catch (error) {
      handleError()
    }
  }
  
  return (
    <AuthContext.Provider value={{isAuthenticated, hasError, signIn}}>
      {children}
    </AuthContext.Provider>
  )
}

