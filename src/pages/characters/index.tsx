import styles from './Characters.module.scss'
import { Container, Progress, Button } from 'nes-react';
import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import Router from 'next/router';
import { setCookie } from 'nookies';

export default function Characters() {
  const { me, user, setCurrentChar } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    me().then(() => setIsLoading(false))
  }, [])

  function handleDetails(id: number){
    const char = user.chars.find(c => c.id === id)
    setCookie(null, "charID", String(char.id), {
      maxAge: 30 * 24 * 60 * 60,
    })
    
    setCurrentChar(char)
    Router.push("/details")
  }

  return (
    <>
      <header className={styles.header}>
        <h1>Select your character</h1>
      </header>
      <div className={styles.container}>
        {isLoading ? (
          <h2>Carregando...</h2>
        ) : (
          <ul>
            {
              user.chars?.map(char => {
                return (
                  <li key={char.id}>
                    <Container rounded>
                      <h2>{char.name}</h2>
                      <div>
                        <strong>HP</strong>
                        <Progress error className={styles.progress} value={char.current_health} max={char.health} />
                      </div>
                      <div>
                        <strong>MP</strong>
                        <Progress primary className={styles.progress} value={char.current_mana} max={char.mana} />
                      </div>
                      <div>
                        {/*// @ts-ignore: Unreachable code error*/}
                        <Button onClick={() => handleDetails(char.id)} success >
                          Selecionar
                        </Button>
                      </div>
                    </Container>
                  </li>
                )
              })
            }
          </ul>
        )}
      </div>
    </>
  );
}