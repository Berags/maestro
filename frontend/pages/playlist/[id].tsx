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
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import { useEffect, useState } from 'react'
import useAudioPlayer from '../../utils/useAudioPlayer'
import { BsThreeDots } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { FiEdit3 } from 'react-icons/fi'
import { LuPin } from 'react-icons/lu'
import { IoShuffleOutline } from 'react-icons/io5'

const PlaylistView = ({ playlist, top_recordings }: any) => {
  const { data }: any = useSession()
  const [expand, setExpand] = useState(true)
  const [updated, setUpdated] = useState(false)
  const router = useRouter()
  const audioPlayer = useAudioPlayer()
  const [playlistData, setPlaylistData] = useState(playlist)

  useEffect(() => {
    const getComposers = async () => {
      if (data) {
        const res_pages = await backend({
          method: 'get',
          url: '/playlist/by-id/' + router.query.id,
          headers: {
            Authorization: data.token,
          },
        })
        setPlaylistData(res_pages.data)
        setUpdated(false)
      }
    }

    getComposers()
  }, [updated])

  if (!data) {
    return <Skeleton />
  }

  return (
    <Box px={4} pt={4}>
      <HStack>
        <Image
          w={64}
          rounded={6}
          src={playlistData.image_url}
          alt={'Playlist image'}
        />
        <Box>
          <Flex px={6} verticalAlign={'center'} pb={4}>
            <Text as="b" fontSize={'3xl'} ml={2}>
              {playlistData.name}
            </Text>
          </Flex>
          <Markdown>
            {playlistData.description
              ? playlistData.description.slice(0, 150) + '...'
              : ''}
          </Markdown>
          <Modal isOpen={!expand} onClose={() => setExpand(true)} size={'2xl'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{playlistData.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody textAlign={'justify'}>
                <Markdown>{playlistData.description}</Markdown>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Button variant={'link'} ml={8} onClick={() => setExpand(!expand)}>
            {expand ? 'Read more' : 'close'}
          </Button>
        </Box>
      </HStack>
      <HStack py={4}>
        <IconButton
          isRound={true}
          icon={<FaPlay />}
          size={'lg'}
          aria-label={'Play all'}
          colorScheme={'facebook'}
          onClick={() => {
            audioPlayer.setQueue(playlistData.recordings)
          }}
        />
        <IconButton
          aria-label={'Shuffle'}
          icon={<IoShuffleOutline />}
          isRound
          size={'lg'}
          colorScheme="facebook"
          variant={'ghost'}
        />
        <Menu>
          <MenuButton
            as={IconButton}
            isRound={true}
            size={'lg'}
            variant={'ghost'}
            aria-label={'Play all'}
            colorScheme={'facebook'}
            onClick={() => {}}
            icon={<BsThreeDots />}
          />
          <MenuList>
            <MenuItem>
              <LuPin />
              <Text ml={2}>Pin</Text>
            </MenuItem>
            <MenuItem>
              <FiEdit3 />
              <Text ml={2}>Edit</Text>
            </MenuItem>
            <MenuItem>
              <MdDelete />
              <Text ml={2}>Delete</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <Separator text="Recordings" />
      <SimpleGrid
        spacingX={1}
        mb={5}
        justifyItems={'center'}
        border={'1px'}
        borderColor={'gray.200'}
        borderRadius={6}
        p={4}
        columns={[1, 1, 1, 1, 1, 1]}
      >
        {playlistData.recordings.map((rec: any, i: any) => (
          <Box w={'100%'}>
            <PieceCard variant="pl" pieceData={rec} />
          </Box>
        ))}
      </SimpleGrid>
      <Separator text={'Recordings you may like'} />
      <SimpleGrid
        columns={[1, 1, 2, 3, 4, 5]}
        spacing={5}
        mb={5}
        justifyItems={'center'}
      >
        {top_recordings.map((val: any, i: number) => (
          <PieceCard request setUpdated={setUpdated} pieceData={val} />
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

  const res = await backend.get('/playlist/by-id/' + id, {
    headers: {
      Authorization: session.token,
    },
  })

  const res_top_recordings = await backend.get(`/recording/top`, {
    headers: {
      Authorization: session.token,
    },
  })

  return {
    props: {
      session: session ?? [],
      playlist: res.data,
      top_recordings: res_top_recordings.data,
    },
  }
}

export default PlaylistView
