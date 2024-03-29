import { useEffect, useState } from 'react'
import useSound from 'use-sound' // for handling the sound
import { IconContext } from 'react-icons' // for customazing the icons
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
} from 'react-icons/tb'
import {
  Button,
  Flex,
  VStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/react'
import { useWindowSize } from '../utils/useWindowSize'

const PlayerFooter = (props: any) => {
  const size = useWindowSize()
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [time, setTime] = useState({
    min: 0,
    sec: 0,
  })
  const [play, { pause, duration, sound }] = useSound(props.streamUrl)
  const [currTime, setCurrTime] = useState({
    min: '',
    sec: '',
  }) // current position of the audio in minutes and seconds

  const [seconds, setSeconds] = useState() // current position of the audio in seconds

  useEffect(() => {
    const sec = duration! / 1000
    const min = Math.floor(sec / 60)
    const secRemain = Math.floor(sec % 60)
    setTime({
      min: min,
      sec: secRemain,
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([])) // setting the seconds state with the current state
        const min = Math.floor(sound.seek([]) / 60) + ''
        const sec = Math.floor(sound.seek([]) % 60) + ''
        setCurrTime({
          min,
          sec,
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [sound])

  const playingButton = () => {
    if (isPlaying) {
      pause()
      setIsPlaying(false)
    } else {
      play()
      setIsPlaying(true)
    }
  }

  return (
    <Flex>
      <Flex marginLeft={10}>
        <Button colorScheme="blue" variant="ghost">
          <IconContext.Provider value={{ size: '2em', color: '#2B6CB0' }}>
            <TbPlayerTrackPrevFilled />
          </IconContext.Provider>
        </Button>
        {!isPlaying ? (
          <Button colorScheme="blue" variant="ghost" onClick={playingButton}>
            <IconContext.Provider value={{ size: '2em', color: '#2B6CB0' }}>
              <TbPlayerPlayFilled />
            </IconContext.Provider>
          </Button>
        ) : (
          <Button colorScheme="blue" variant="ghost" onClick={playingButton}>
            <IconContext.Provider value={{ size: '2em', color: '#2B6CB0' }}>
              <TbPlayerPauseFilled />
            </IconContext.Provider>
          </Button>
        )}
        <Button colorScheme="blue" variant="ghost">
          <IconContext.Provider value={{ size: '2em', color: '#2B6CB0' }}>
            <TbPlayerTrackNextFilled />
          </IconContext.Provider>
        </Button>
      </Flex>
      <VStack ml={10} w={size.width / 2}>
        <Text>Chopin</Text>
        <Slider
          aria-label="slider-ex-1"
          defaultValue={0}
          value={seconds}
          max={duration ? duration / 1000 : 0}
          onChange={(val) => {
            sound.seek([val])
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg="teal.500"
            color="white"
            placement="top"
            isOpen={showTooltip}
            label={`${seconds}%`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
      </VStack>
    </Flex>
  )
}
export default PlayerFooter
