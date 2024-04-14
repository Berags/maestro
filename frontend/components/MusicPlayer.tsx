import { Center, HStack } from '@chakra-ui/react'
import { createRef, useEffect, useRef, useState } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import useAudioPlayer from '../utils/useAudioPlayer'
import { Image } from '@chakra-ui/react'
import backend from '../axios.config'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useWindowSize } from '../utils/useWindowSize'
const MusicPlayer = () => {
  const audioPlayer = useAudioPlayer()
  const size = useWindowSize()
  const player = createRef<any>()
  const { data }: any = useSession()

  useEffect(() => {
    if (audioPlayer.current) {
      const listen = async () => {
        const res = await backend.post(
          '/recording/listen/' + audioPlayer.current?.id,
          {},
          {
            headers: {
              Authorization: data.token,
            },
          }
        )
      }

      listen()
    }
  }, [audioPlayer.current])

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
    <HStack w={'100%'}>
      {audioPlayer.current ? (
        <Image
          src={audioPlayer.current?.image_url}
          w={size.width > 400 ? '7em' : '0em'}
          alt="Dan Abramov"
          mr={-2}
        />
      ) : null}
      <AudioPlayer
        style={{}}
        src={audioPlayer.current ? audioPlayer.current?.file_url : ''}
        onPlay={async () => {}}
        onClickNext={handleEndOrSkip}
        onClickPrevious={handlePrevious}
        onEnded={handleEndOrSkip}
        preload="metadata"
        showSkipControls
        showJumpControls={false}
        header={<Center>{audioPlayer.current?.title}</Center>}
        ref={player}
      />
    </HStack>
  )
}

export default MusicPlayer
