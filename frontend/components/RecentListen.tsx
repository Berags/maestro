import {
  AbsoluteCenter,
  Avatar,
  Box,
  Container,
  Divider,
  Icon,
  Stack,
  Image,
  Text,
  HStack,
  VStack,
  IconButton,
  Heading,
  Flex,
} from '@chakra-ui/react'
import { NextComponentType } from 'next'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { MdOutlineOpenInNew } from 'react-icons/md'
import useAudioPlayer from '../utils/useAudioPlayer'
import Markdown from 'react-markdown'
import remarkHtml from 'remark-html'
import { useWindowSize } from '../utils/useWindowSize'

type Props = {
  listen: any
}

const RecentListen = ({ listen }: Props) => {
  const router = useRouter()
  const size = useWindowSize()
  const audioPlayer = useAudioPlayer()
  return (
    <Container maxW="5xl" p={{ base: 5, md: 8 }}>
      <Fragment key={listen.recording.id}>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          bgGradient="linear(to-br, gray.100, gray.200)"
          spacing={{ base: 0, sm: 10 }}
          p={{ base: 4, sm: 10 }}
          rounded="lg"
          justifyContent="flex-start"
        >
          <Box width={size.width > 500 ? '12rem' : '0em'} pos="relative">
            <Image
              pos="absolute"
              rounded="lg"
              src={listen.recording.image_url}
              top="-3.8rem"
              boxShadow="lg"
            />
          </Box>

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
