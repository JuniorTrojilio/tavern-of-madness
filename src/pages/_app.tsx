import { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { UserProvider } from '../context/UserContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </AuthProvider>
  )
}

export default MyApp
