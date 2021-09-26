import { useEffect } from 'react';
import styles from './Audio.module.scss';

export const Audio = () => {
  const handleEnter = () => {
    const audioPlayer = document.getElementById("audioplay") as HTMLAudioElement; 
    audioPlayer.play(); 
    audioPlayer.loop = true;
  }

  useEffect(() =>{
    handleEnter()
  }, [])

  return (
    <div className={styles.container}>
      <audio id="audioplay" controls preload="true" autoPlay>
        <source src="/music/theme.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}