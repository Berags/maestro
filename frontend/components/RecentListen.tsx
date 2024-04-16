import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { prominent } from 'color.js'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Fragment, useState } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { MdOutlineOpenInNew } from 'react-icons/md'
import Markdown from 'react-markdown'
import remarkHtml from 'remark-html'
import useAudioPlayer from '../utils/useAudioPlayer'
import { useWindowSize } from '../utils/useWindowSize'

type Props = {
  listen: any
}

const RecentListen = ({ listen }: Props) => {
  const router = useRouter()
  const size = useWindowSize()
  const audioPlayer = useAudioPlayer()
  const [colors, setColors] = useState<any>(['#000000', '#000000'])
  useEffect(() => {
    const fetchColor = async () => {
      const color = await prominent(listen.recording.image_url, {
        amount: 5,
        format: 'hex',
      })
      console.log(color)
      setColors([color[1], color[2]])
    }
    fetchColor()
  }, [listen.recording.image_url])

  return (
    <Container
      maxW="5xl"
      p={{ base: 5, md: 8 }}
      textColor={
        '#' +
        (
          '000000' + (0xffffff ^ colors[0].replace('#', '0x')).toString(16)
        ).slice(-6)
      }
    >
      <Fragment key={listen.recording.id}>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          bgColor={colors[1]}
          spacing={{ base: 0, sm: 10 }}
          p={{ base: 4, sm: 10 }}
          rounded="lg"
          justifyContent="flex-start"
        >
          <VStack>
            <Box width={size.width > 500 ? '12rem' : '0em'} pos="relative">
              <Image
                pos="absolute"
                rounded="lg"
                src={listen.recording.image_url}
                top="-3.8rem"
                boxShadow="lg"
              />
            </Box>
          </VStack>
          <Stack direction="column" spacing={4} textAlign="left" maxW="4xl">
            <Heading as="h2" fontSize={'xl'}>
              {listen.opus.title}
            </Heading>
            <HStack>
              <IconButton
                aria-label={'play'}
                icon={<FaPlay />}
                w={10}
                h={10}
                color="gray.700"
                onClick={() => {
                  audioPlayer.setCurrent(listen.recording)
                }}
                variant={'link'}
              />
              <Text>{listen.recording.title}</Text>
            </HStack>
            <Flex fontSize="md" fontWeight="medium">
              <Box>
                <Markdown remarkPlugins={[remarkHtml]}>
                  {listen.opus.description.slice(0, 60) + '...'}
                </Markdown>
              </Box>
              <IconButton
                aria-label={'More'}
                icon={<MdOutlineOpenInNew />}
                variant={'link'}
                onClick={() => {
                  router.push('/opus/' + listen.opus.id)
                }}
              />
            </Flex>
          </Stack>
        </Stack>
      </Fragment>
    </Container>
  )
}

export default RecentListen
