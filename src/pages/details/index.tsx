import { Button, Container, Progress } from "nes-react"
import { parseCookies } from "nookies"
import { useEffect, useState } from "react"
import { useUser } from "../../hooks/useUser"
import styles from './Details.module.scss'
import Modal from 'react-modal'
import { AttackProps, Char, Skill, Weapon } from "../../context/UserContext"

const ElementType = ['Fogo', 'Água', 'Terra', 'Vento', 'Raio', 'Dia', 'Noite', 
'Ferro', 'Calor', 'Explosão', 'Magnetismo', 'Luz', 'Gelo', 'Veneno', 'Argila',
'Áreia', 'Lava', 'Pedra', 'Joia', 'Aceleração', 'Som', 'Plasma', 'Telecinese',
'Omni', 'Angelos', 'Gravidade', 'Forma', 'Matéria', 'Lâmina Ensanguentada', 
'Dragão', 'Fábula', 'Ultimo' ];

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
  const { currentChar, getChars, updateMe, chars, attack, meditate } = useUser()
  const charID = parseCookies()['charID']

  const [stage, setStage] = useState(0)
  // 0 = select oponent
  // 1 = select skill
  // 2 = select weapon


  useEffect(() => {
    getChars().then(() => {
      setIsLoading(false)
    })

    if (currentChar.id === undefined) {
      setIsLoading(true)
      updateMe(Number(charID)).then(() => {
        setIsLoading(false)
      })
    }
  }, [])

  async function handleMeditate() {
    const status = await meditate(currentChar.id)
    if (status === 204) {
      setMeditationComplete(true)
      updateMe(currentChar.id)
    }
    setTimeout(() => {
      setMeditationModalIsOpen(false);
      setMeditationComplete(false)
    }, 3000)
  }

  function handleCloseModal() {
    setAtackModalIsOpen(false);
    setStage(0)
  }

  async function buildAtack(id: number){
    const attackPrepare: AttackProps = {
      attacker_id: currentChar.id,
      deffender_id: 0,
      skill_id: 0,
      weapon_id: 0,
    }

    if (stage === 0){
      attackPrepare.deffender_id = id
      setStage(1)
    }else if (stage === 1){
      attackPrepare.skill_id = id
      setStage(2)
    }else{
      attackPrepare.weapon_id = id
      const status = await attack(attackPrepare)
      if (status === 204){
        setAtackModalIsOpen(false)
        setStage(0)
        attackPrepare.deffender_id = 0
        attackPrepare.skill_id = 0
        attackPrepare.weapon_id = 0
      }
    }
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
          {/*// @ts-ignore: Unreachable code error*/}
          <Button onClick={() => buildAtack(c.id)} success>Selecionar</Button>
        </div>
      </Container>
    ))
  }

  function handleWeaponList(weapon_list: Weapon[]){
    return weapon_list.map(w => (
      <Container key={w.id}>
        <div className={styles.weaponInfo}>
          <div className={styles.weaponStats}>
            <strong>Nome: {w.name}</strong>
          </div>
          <div className={styles.weaponStats}>
            <strong>Tipo: {w.weapon_type}</strong>
          </div>
          <div className={styles.weaponStats}>
            <strong>Tipo de Dano: {w.damage_type}</strong>
          </div>
          <div className={styles.weaponStats}>
            <strong>Descrição: {w.description}</strong>
          </div>
          {/*// @ts-ignore: Unreachable code error*/}
          <Button onClick={() => buildAtack(w.id)} success>Selecionar</Button>
        </div>
      </Container>
    )
  )}

  function handleSkillList(skill_set: Skill[]){
    return skill_set.map(s => (
      <Container key={s.id}>
        <div className={styles.skillInfo}>
          <div className={styles.skillStats}>
            <strong>Nome: {s.name}</strong>
          </div>
          <div className={styles.skillStats}>
            <strong>Nível: {s.level}</strong>
          </div>
          <div className={styles.skillStats}>
            <strong>Custo: {s.cost}</strong>
          </div>
          <div className={styles.skillStats}>
            <strong>Multiplicador de dano: {s.damage_multiplier}</strong>
          </div>
          <div className={styles.skillStats}>
            <strong>Tipo: {s.damage_type}</strong>
          </div>
          <div className={styles.skillStats}>
            <strong>Elemento: {ElementType[s.element - 1]}</strong>
          </div>
          <div className={styles.skillStats}>
            <strong>Descrição: {s.description}</strong>
          </div>
          {/*// @ts-ignore: Unreachable code error*/}
          <Button onClick={() => buildAtack(s.id)} success>Selecionar</Button>
        </div>
      </Container>
    ))
  }

  

  function handleModalContent() {
    if (stage === 0) {
      return (
        <Container>
          <h2>Selecione quem diabos você vai atacar?</h2>
          <div className={styles.charCard}>
            {handleCharList(chars)}
          </div>
        </Container>
      )
    }else if ( stage === 1) {
      return (
        <Container>
          <h2>Selecione o ataque que você vai usar:</h2>
          <div className={styles.charCard}>
            {handleSkillList(currentChar.skill_set)}
          </div>
        </Container>
      )
    }else{
      return (
        <Container>
          <h2>Selecione a arma que você vai usar:</h2>
          <div className={styles.charCard}>
            {handleWeaponList(currentChar.weapon_list)}
          </div>
        </Container>
      )
    }
  }

  return (
    <>
      {isLoading ? (
        <Container rounded centered>
          <div className={styles.isLoading}>
            <h1>Carregando...</h1>
          </div>
        </Container>
      ) : (
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
            onRequestClose={handleCloseModal}
            style={customStyles}
            contentLabel="Example Modal"
            className={styles.Modal}
          >
            {handleModalContent()}
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
            <div>
              <strong>Elemento Principal: {currentChar.element.name}</strong>
            </div>
            <div>
              <strong>Tipo: {currentChar.element.element_type}</strong>
            </div>
          </header>

          <div className={styles.container}>
            <div className={styles.buttonContainer}>
              {/*// @ts-ignore: Unreachable code error*/}
              <Button onClick={() => setAtackModalIsOpen(true)} error>Atacar</Button>
              {/*// @ts-ignore: Unreachable code error*/}
              <Button onClick={() => setMeditationModalIsOpen(true)} warning >Meditar</Button>
            </div>
            <div className={styles.infoCharacter}>
              <div className={styles.att}>
                <strong>Força: {currentChar.strength}</strong>
                <strong>Destreza: {currentChar.dexterity}</strong>
              </div>
              <div className={styles.att}>
                <strong>Vitalidade: {currentChar.vitality}</strong>
                <strong>Afinidade Magica: {currentChar.magical_affinity}</strong>
              </div>
              <div className={styles.att}>
                <strong>Aura: {currentChar.aura} </strong>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}