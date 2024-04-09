import { Center } from '@chakra-ui/react'
import { createRef, useEffect, useRef, useState } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import useAudioPlayer from '../utils/useAudioPlayer'

const MusicPlayer = () => {
  const audioPlayer = useAudioPlayer()
  const player = createRef<any>()

  useEffect(() => {
    if (!audioPlayer.current && audioPlayer.queue.length > 0) {
      audioPlayer.setCurrent(audioPlayer.queue[0])
      audioPlayer.setQueue(audioPlayer.queue.slice(1))
    }
  }, [audioPlayer.queue])

  const handleEndOrSkip = () => {
    if (audioPlayer.queue.length > 0) {
      // there is a queue
      audioPlayer.setCurrent(audioPlayer.queue[0])
      audioPlayer.setQueue(audioPlayer.queue.slice(1))
    } else {
      audioPlayer.removeCurrent()
    }
  }

  const handlePrevious = () => {
    player.current.setJumpTime(-1000 * 60 * 60 * 24)
  }

  return (
    <AudioPlayer
      src={audioPlayer.current ? audioPlayer.current?.file_url : ''}
      onPlay={(e) => console.log('onPlay')}
      onClickNext={handleEndOrSkip}
      onClickPrevious={handlePrevious}
      onEnded={handleEndOrSkip}
      preload="metadata"
      showSkipControls
      showJumpControls={false}
      header={<Center>{audioPlayer.current?.title}</Center>}
      ref={player}
    />
  )
}

export default MusicPlayer
