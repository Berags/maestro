import {
  Box,
  Button,
  Text,
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
  Skeleton,
  Image
} from '@chakra-ui/react'
import Separator from '../../components/Separator'
import backend from '../../axios.config'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { useRouter } from 'next/router'
import { FaPlay } from 'react-icons/fa6'
import Markdown from 'react-markdown'
import PieceCard from '../../components/search/PieceCard'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useAudioPlayer from '../../utils/useAudioPlayer'

const PlaylistView = ({ playlist }: any) => {
  const { data }: any = useSession()
  const [expand, setExpand] = useState(true)
  const router = useRouter()
  const audioPlayer = useAudioPlayer()

  if (!data) {
    return <Skeleton />
  }
  return (
    <>
      <Box px={4} pt={4}>
        <HStack>
          <Image w={64} rounded={6} src={playlist.image_url} alt={'Playlist image'} />
          <Box>
            <Flex px={6} verticalAlign={'center'} pb={4}>
              <IconButton
                isRound={true}
                variant="ghost"
                icon={<FaPlay />}
                fontSize="2em"
                colorScheme="grey"
                aria-label={'Play all'}
                onClick={() => {
                  audioPlayer.setQueue(playlist.recordings)
                }}
              />
              <Text as="b" fontSize={'3xl'} ml={4}>
                {playlist.name}
              </Text>
            </Flex>
            <Markdown>
              {playlist.description
                ? playlist.description.slice(0, 150) + '...'
                : ''}
            </Markdown>
            <Modal
              isOpen={!expand}
              onClose={() => setExpand(true)}
              size={'2xl'}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{playlist.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody textAlign={'justify'}>
                  <Markdown>{playlist.description}</Markdown>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Button variant={'link'} ml={8} onClick={() => setExpand(!expand)}>
              {expand ? 'Read more' : 'close'}
            </Button>
          </Box>
        </HStack>
        <Separator text="Recordings" />
        <SimpleGrid
          spacing={1}
          mb={5}
          justifyItems={'center'}
          columns={[1, 1, 1, 1, 1, 1]}
        >
          {playlist.recordings.map((rec: any) => (
            <PieceCard pieceData={rec} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session || !context.params) {
    return { redirect: { destination: '/' } }
  }

  const id = context.params.id // Get ID from slug

  const res = await backend.get('/playlist/by-id/' + id, {
    headers: {
      Authorization: session.token,
    },
  })

  console.log(res.data)

  return {
    props: {
      session: session ?? [],
      playlist: res.data,
    },
  }
}

export default PlaylistView
