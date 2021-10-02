import { Button, Container, Progress } from "nes-react"
import { parseCookies } from "nookies"
import { useEffect, useState } from "react"
import { useUser } from "../../hooks/useUser"
import styles from './Details.module.scss'
import Modal from 'react-modal'
import { Char } from "../../context/UserContext"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


export default function Details() {
  const [isLoading, setIsLoading] = useState(true)
  const [meditationComplete, setMeditationComplete] = useState(false)
  const [meditationModalIsOpen, setMeditationModalIsOpen] = useState(false);
  const [atackModalIsOpen, setAtackModalIsOpen] = useState(false);
  const { currentChar, getChars, updateMe, chars } = useUser()
  const charID = parseCookies()['charID']


  useEffect(() => {
    getChars()
    if (currentChar.id === undefined) {
      setIsLoading(true)
      updateMe(Number(charID)).then(() => {
        setIsLoading(false)
      })
    }
  }, [])

  function handleMeditate() {
    setMeditationComplete(true)
    setTimeout(() => {
      setMeditationModalIsOpen(false);
      setMeditationComplete(false)
    }, 3000)
  }

  function handleCharList(char: Char[]) {
    return char.map(c => (c.id !== currentChar.id) && (
      <Container key={c.id}>
        <div 
          className={
            ` ${styles.charInfo} 
              ${c.char_type === "NPC" && styles.npc}
              ${c.char_type === "PLAYER" && styles.player}
              ${c.char_type === "MOB" && styles.mob}
            `}>
          <strong>{c.name}</strong>
          <strong>{c.char_type}</strong>
          <strong>Nível: {c.level}</strong>
          <div className={styles.charStats}>
            <strong>HP</strong>
            <Progress className={styles.miniBar} error value={c.current_health} max={c.health} />
          </div>
          <div className={styles.charStats}>
            <strong>MP</strong>
            <Progress className={styles.miniBar} primary value={c.current_mana} max={c.mana} />
          </div>
          <Button success>Selecionar</Button>
        </div>
      </Container>
    ))
  }

  return (
    <>
      <Modal
        isOpen={meditationModalIsOpen}
        onRequestClose={() => setMeditationModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Container>
          {meditationComplete ? (
            <>
              <h2>Meditação completa!</h2>
              <p>Calma, n clica em nada que essa poha fecha sozinha</p>
            </>
          ) : (
            <>
              <h2>O mestre te deixou meditar?</h2>
              <div className={styles.meditationDialog}>
                {/*// @ts-ignore: Unreachable code error*/}
                <Button onClick={handleMeditate} success >Sim</Button>
                {/*// @ts-ignore: Unreachable code error*/}
                <Button onClick={() => setMeditationModalIsOpen(false)} error >Não, eu quero meditar pq sou corno!</Button>
              </div>
            </>)}
        </Container>
      </Modal>
      <Modal
        isOpen={atackModalIsOpen}
        onRequestClose={() => setAtackModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
        className={styles.Modal}
      >
        <Container>
          <h2>Selecione quem diabos você vai atacar?</h2>
          <div className={styles.charCard}>
            {handleCharList(chars)}
          </div>
        </Container>
      </Modal>
      <header className={styles.header}>
        <h1>{currentChar.name}</h1>
        <div>
          <strong>HP</strong>
          <Progress className={styles.bar} error value={currentChar.current_health} max={currentChar.health} />
        </div>
        <div>
          <strong>MP</strong>
          <Progress className={styles.bar} primary value={currentChar.current_mana} max={currentChar.mana} />
        </div>
        <div>
          <strong>Nivel: {currentChar.level}</strong>
        </div>
        <div>
          <strong>XP</strong>
          <Progress className={styles.xpBar} warning value={currentChar.exp_gauge} max={currentChar.exp_to_next} />
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.buttonContainer}>
          {/*// @ts-ignore: Unreachable code error*/}
          <Button onClick={() => setAtackModalIsOpen(true)} error>Atacar</Button>
          {/*// @ts-ignore: Unreachable code error*/}
          <Button onClick={() => setMeditationModalIsOpen(true)} warning >Meditar</Button>
        </div>
      </div>
    </>
  )
}