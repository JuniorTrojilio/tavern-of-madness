import { Avatar, Button, Container, Progress } from "nes-react"
import { useUser } from "../../hooks/useUser"
import { api } from "../../services/api"
import styles from './Details.module.scss'



export default function Details() {
  const { currentChar } = useUser()

  function handleMeditate() {
    const response = api.patch(`/chars/meditate/${currentChar.id}/`)
  }

  return (
    <>
      <header className={styles.header}>
        <h1>{currentChar.name}</h1>
        <div>
          <strong>HP</strong>
          <Progress className={styles.bar} error value={currentChar.current_health} max={currentChar.health} />
        </div>
        <div>
          <strong>MP</strong>
          <Progress className={styles.bar} primary value={currentChar.current_health} max={currentChar.health} />
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.buttonContainer}>
          <Button error>Atacar</Button>
          {/*// @ts-ignore: Unreachable code error*/}
          <Button onClick={handleMeditate} warning >Meditar</Button>
        </div>
      </div>
    </>
  )
}