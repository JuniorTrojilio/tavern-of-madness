import { TextInput, Button, Balloon, Container } from 'nes-react'
import { FormEvent, useState } from 'react'
import { Audio } from '../components/Audio'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import styles from './Home.module.scss'

export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const {signIn, hasError} = useAuth()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    const values = {
      username,
      password
    }

    await signIn(values).then(() => {
      setIsLoading(false)
    })
  }

  const handleChangeForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUsername(e.currentTarget.username.value)
    setPassword(e.currentTarget.password.value)
  }

  return (
    <div className={styles.container}>
      <h1>Taverna da Loucura</h1>
      <form onSubmit={handleSubmit} onChange={(e) => handleChangeForm(e)}>
        <TextInput  required label="Usuário" name="username" type="text" value={username} />
        <TextInput  required label="Senha" name="password" type="password" value={password} />
        {!isLoading ? (
          <Button className={styles.button} warning>Entrar</Button>
        ) : (
          <div className={styles.loading}>
            <img src="/loading.gif" alt="loading" />
          </div>
        )}
      </form>
      {hasError && (<Balloon className={styles.ballon} >Senha incorreta, tente novamente!</Balloon>)}
    </div>
  )
}
