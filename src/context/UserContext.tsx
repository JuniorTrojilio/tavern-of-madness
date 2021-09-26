import { createContext, useState } from 'react';
import { api } from '../services/api';

type UserContextType = {
  user: User
  currentChar: Char
  setCurrentChar: (char: Char) => void
  me(): Promise<void>
  hasError: boolean
}

type User = {
  id: number
  chars: Char[]
}

export type Char = {
  id: number
  health: number
  mana: number
  current_health: number
  current_mana: number
  exp_to_next: number
  name: string
  image: string
  assosiation: string
  god: string
  race: string
  nation: string
  order: string
  morale: string
  inframark: string
  level: number
  aura: number
  meditation: number
  exp_gauge: number
  strength: number
  dexterity: number
  magical_affinity: number
  vitality: number
  gold: number
  silver: number
  bronze: number
  char_type: string
  element: Element[]
  weapon_list: Weapon[]
  pet: Pet[]
}

type Element = {
  id: number
  name: string
  element_type: string
  color: string
  base: number[]
  dominancy: number[]
}

type Weapon = {
  id: number
  name: string
  weapon_type: string
  damage_type: string
  bound: boolean
  description: string
}

type Pet = {
  id: number
  name: string
  pet_type: string
  rank: string
  bound: boolean
  description: string
}

interface UserProviderProps {
  children: React.ReactNode
}

export const UserContext = createContext({} as UserContextType)



export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({} as User)
  const [currentChar, setCurrentChar] = useState<Char>({} as Char)
  const [hasError, setHasError] = useState(false)

  async function me() {
    try {
      const response = await api.get<User>('/users/me')
      const user = response.data
      setUser(user)
    } catch (error) {
      setHasError(true)
    }   
  }

  return (
    <UserContext.Provider value={{user, hasError, me, currentChar, setCurrentChar }}>
      {children}
    </UserContext.Provider>
  )
}