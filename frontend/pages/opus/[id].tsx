import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { MdKeyboardArrowRight } from 'react-icons/md'
import Markdown from 'react-markdown'
import backend from '../../axios.config'
import PieceCard from '../../components/PieceCard'
import Separator from '../../components/Separator'
import useAudioPlayer from '../../utils/useAudioPlayer'
import { authOptions } from '../api/auth/[...nextauth]'

const Opus: any = ({ recordings, opus, composer }: any) => {
  const { data }: any = useSession()
  const [expand, setExpand] = useState(true)
  const router = useRouter()
  const audioPlayer = useAudioPlayer()

  if (!data) {
    return <>loading</>
  }

  return (
    <Box px={4} pt={4}>
      <HStack pb={4} ml={4}>
        <Avatar name={composer.name} src={composer.portrait} />
        <Text fontSize={'xl'} ml={4} height={'100%'} verticalAlign={'middle'}>
          {composer.name}
        </Text>
        <IconButton
          aria-label={'Visit composer'}
          variant={'link'}
          icon={<MdKeyboardArrowRight />}
          fontSize={'1.5em'}
          onClick={() => {
            router.push('/composer/' + composer.id)
          }}
          ml={-4}
        />
      </HStack>
      <Flex px={6} verticalAlign={'center'} pb={4}>
        <IconButton
          isRound={true}
          variant="ghost"
          icon={<FaPlay />}
          fontSize="2em"
          colorScheme="grey"
          aria-label={'Play all'}
          onClick={() => {
            console.log(recordings)
            audioPlayer.setQueue(recordings)
          }}
        />
        <Text as="b" fontSize={'3xl'} ml={4}>
          {opus.title}
        </Text>
      </Flex>
      <Box px={8}>
        <Markdown>{opus.description.slice(0, 150) + '...'}</Markdown>
      </Box>
      <Modal isOpen={!expand} onClose={() => setExpand(true)} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{opus.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={'justify'} px={8}>
            <Markdown>{opus.description}</Markdown>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button variant={'link'} onClick={() => setExpand(!expand)}>
        {expand ? 'Read more' : 'close'}
      </Button>
      <Separator text="Recordings" />
      <SimpleGrid
        spacing={5}
        mb={5}
        justifyItems={'center'}
        columns={[1, 1, 2, 3, 4, 5]}
      >
        {recordings.map((rec: any) => (
          <PieceCard pieceData={rec} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session || !context.params) {
    return { redirect: { destination: '/' } }
  }

  const id = context.params.id // Get ID from slug

  const res_composer = await backend.get('/composer/by-opus-id/' + id, {
    headers: {
      Authorization: session.token,
    },
  })

  const res_opus = await backend.get(`/opus/` + id, {
    headers: {
      Authorization: session.token,
    },
  })

  const res = await backend.get(`/recording/by-opus/` + id, {
    headers: {
      Authorization: session.token,
    },
  })

  return {
    props: {
      session: session ?? [],
      recordings: res.data,
      opus: res_opus.data,
      composer: res_composer.data,
    },
  }
}

export default Opus
