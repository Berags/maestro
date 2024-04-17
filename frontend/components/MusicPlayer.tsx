import { Center, HStack, IconButton } from '@chakra-ui/react'
import { createRef, useEffect, useRef, useState } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import useAudioPlayer from '../utils/useAudioPlayer'
import { Image } from '@chakra-ui/react'
import backend from '../axios.config'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useWindowSize } from '../utils/useWindowSize'
import { IoShuffle } from 'react-icons/io5'

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
      if (audioPlayer.shuffle) {
        // shuffle is on
        const randomIndex = Math.floor(Math.random() * audioPlayer.queue.length)
        audioPlayer.setCurrent(audioPlayer.queue[randomIndex])
        audioPlayer.setQueue(
          audioPlayer.queue.filter((_, index) => index !== randomIndex)
        )
      } else {
        audioPlayer.setCurrent(audioPlayer.queue[0])
        audioPlayer.setQueue(audioPlayer.queue.slice(1))
      }
    }
  }, [audioPlayer.queue])

  const handleEndOrSkip = () => {
    if (audioPlayer.queue.length > 0) {
      // there is a queue
      if (audioPlayer.shuffle) {
        // shuffle is on
        const randomIndex = Math.floor(Math.random() * audioPlayer.queue.length)
        audioPlayer.setCurrent(audioPlayer.queue[randomIndex])
        audioPlayer.setQueue(
          audioPlayer.queue.filter((_, index) => index !== randomIndex)
        )
      } else {
        audioPlayer.setCurrent(audioPlayer.queue[0])
        audioPlayer.setQueue(audioPlayer.queue.slice(1))
      }
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
        customAdditionalControls={[
          <IconButton
            fontSize={audioPlayer.shuffle ? '2xl' : '3xl'}
            variant={audioPlayer.shuffle ? 'solid' : 'link'}
            colorScheme={audioPlayer.shuffle ? 'facebook' : 'gray'}
            icon={<IoShuffle />}
            aria-label={'shuffle'}
            onClick={() => audioPlayer.setShuffle(!audioPlayer.shuffle)}
          />,
        ]}
      />
    </HStack>
  )
}

export default MusicPlayer
