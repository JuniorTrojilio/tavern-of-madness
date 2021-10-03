import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  const {attack, meditate, user, hasError, me, currentChar, setCurrentChar, updateMe, chars, getChars } = context
  return {attack, meditate, user, hasError, me, currentChar, setCurrentChar, updateMe, chars, getChars }
}