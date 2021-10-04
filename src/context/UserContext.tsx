import router from 'next/router';
import { destroyCookie } from 'nookies';
import { createContext, useState } from 'react';
import { api } from '../services/api';

type UserContextType = {
  user: User
  currentChar: Char
  setCurrentChar: (char: Char) => void
  me(): Promise<void>
  updateMe(id: number): Promise<void>
  hasError: boolean
  chars: Char[]
  getChars(): Promise<void>
  attack(attackProps: AttackProps): Promise<number>
  meditate(char_id: number): Promise<number>
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
  skill_set: Skill[]
  element: Element
  weapon_list: Weapon[]
  pet: Pet[]
}

export type Skill = {
  id: number
  name: string
  description: string
  cost: number
  damage_type: string
  damage_multiplier: number
  level: number
  attempts: number
  element: number
  char: number
}

type Element = {
  id: number
  name: string
  element_type: string
  color: string
  base: number[]
  dominancy: number[]
}

export type Weapon = {
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

export type AttackProps = {
  attacker_id: number
  weapon_id: number 
  skill_id: number
  deffender_id: number
}

interface UserProviderProps {
  children: React.ReactNode
}

export const UserContext = createContext({} as UserContextType)



export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({} as User)
  const [chars, setChars] = useState<Char[]>([])
  const [currentChar, setCurrentChar] = useState<Char>({} as Char)
  const [hasError, setHasError] = useState(false)

  async function me() {
    try {
      const response = await api.get<User>('/users/me')
      const user = response.data
      setUser(user)
    } catch (error) {
      setHasError(true)
      destroyCookie(null, 'charID')
      destroyCookie(null, 'access')
      destroyCookie(null, 'refresh')
      router.push('/')
    }
  }

  async function meditate(char_id: number){
    try {
      const response = await api.patch<Char>(`/chars/meditate/${char_id}/`)
      return response.status
    } catch (error) {
      setHasError(true)
      destroyCookie(null, 'charID')
      destroyCookie(null, 'access')
      destroyCookie(null, 'refresh')
      router.push('/')
    }
  }

  async function attack({ attacker_id, weapon_id, skill_id,deffender_id }: AttackProps): Promise<number> {
    try {
      const response = await api.patch<Char>('/chars/attack/', {
        attacker_id,
        deffender_id,
        weapon_id,
        skill_id,
      })
      return response.status
    } catch (error) {
      setHasError(true)
      destroyCookie(null, 'charID')
      destroyCookie(null, 'access')
      destroyCookie(null, 'refresh')
      router.push('/')
    }
  }

  async function getChars() {
    try {
      const response = await api.get<Char[]>('/chars')
      const chars = response.data
      setChars(chars)
    } catch (error) {
      setHasError(true)
      destroyCookie(null, 'charID')
      destroyCookie(null, 'access')
      destroyCookie(null, 'refresh')
      router.push('/')
    }
  }

  async function updateMe(id: number) {
    try {
      const response = await api.get<User>('/users/me')
      const user = response.data
      const char = user.chars.find(c => c.id === id)
      setCurrentChar(char)
    } catch (error) {
      setHasError(true)
      destroyCookie(null, 'charID')
      destroyCookie(null, 'access')
      destroyCookie(null, 'refresh')
      router.push('/')
    }
  }

  return (
    <UserContext.Provider value={{attack, meditate, user, chars, hasError, me, currentChar, setCurrentChar, updateMe, getChars }}>
      {children}
    </UserContext.Provider>
  )
}