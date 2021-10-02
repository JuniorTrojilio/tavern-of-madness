import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  const { user, hasError, me, currentChar, setCurrentChar, updateMe, chars, getChars } = context
  return { user, hasError, me, currentChar, setCurrentChar, updateMe, chars, getChars }
}