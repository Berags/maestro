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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Stack,
} from '@chakra-ui/react'
import Separator from '../../components/Separator'
import backend from '../../axios.config'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { useRouter } from 'next/router'
import { FaPlay } from 'react-icons/fa6'
import Markdown from 'react-markdown'
import PieceCard from '../../components/PieceCard'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useAudioPlayer from '../../utils/useAudioPlayer'
import { BsThreeDots } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { FiEdit3 } from 'react-icons/fi'
import { LuPin, LuPinOff } from 'react-icons/lu'
import { IoShuffleOutline } from 'react-icons/io5'
import toast from 'react-hot-toast'
import UpdatePlaylistModal from '../../components/UpdatePlaylistModal'
import React from 'react'

const PlaylistView = ({ playlist, top_recordings }: any) => {
  const { data }: any = useSession()
  const [expand, setExpand] = useState(true)
  const [updated, setUpdated] = useState(false)
  const router = useRouter()
  const audioPlayer = useAudioPlayer()
  const [playlistData, setPlaylistData] = useState(playlist)
  const updatePlaylistDisclose = useDisclosure()
  const confirm = useDisclosure()
  const cancelRef = React.useRef(null)

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
      <Stack direction={['column', 'row']} alignItems="center">
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
          <Box ml={8}>
            <Markdown>
              {playlistData.description
                ? playlistData.description.slice(0, 150) + '...'
                : ''}
            </Markdown>
          </Box>
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
            {expand ? 'Read more' : 'Close'}
          </Button>
        </Box>
      </Stack>
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
          onClick={() => {
            audioPlayer.setShuffle(true)
            audioPlayer.setQueue(playlistData.recordings)
          }}
        />
        <Menu>
          <MenuButton
            as={IconButton}
            isRound={true}
            size={'lg'}
            variant={'ghost'}
            aria-label={'Play all'}
            colorScheme={'facebook'}
            onClick={() => { }}
            icon={<BsThreeDots />}
          />
          <MenuList>
            <MenuItem
              onClick={async () => {
                const res = await backend.post(
                  '/playlist/pin/' + playlistData.id,
                  {},
                  {
                    headers: {
                      Authorization: data.token,
                    },
                  }
                )

                if (res.status === 200) {
                  toast.success('Playlist pinned')
                  setPlaylistData({ ...playlistData, pinned: true })
                }
              }}
            >
              {playlistData.pinned ? <LuPinOff /> : <LuPin />}
              <Text ml={2}>{playlistData.pinned ? 'Unpin' : 'Pin'}</Text>
            </MenuItem>
            <MenuItem onClick={updatePlaylistDisclose.onToggle}>
              <FiEdit3 />
              <Text ml={2}>Edit</Text>
            </MenuItem>
            <MenuItem onClick={confirm.onOpen}>
              <MdDelete />
              <Text ml={2}>Delete</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <UpdatePlaylistModal
        disclosure={updatePlaylistDisclose}
        update={playlistData}
        setUpdated={setUpdated}
      />
      <Separator text="Recordings" />
      <SimpleGrid
        spacingX={1}
        mb={5}
        justifyItems={'center'}
        border={'1px'}
        borderColor={'gray.200'}
        borderRadius={6}
        p={4}
        columns={[1]}
      >
        {playlistData.recordings.map((rec: any) => (
          <Box w={'100%'}>
            <PieceCard
              variant="pl"
              pieceData={rec}
              setUpdated={setUpdated}
              defaultPlaylist={{
                ...playlistData,
                is_in_playlist: playlistData.recordings.some(
                  (rec: any) => rec.id === rec.id
                ),
              }}
            />
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
          <PieceCard
            request
            setUpdated={setUpdated}
            pieceData={val}
            variant="sg"
            defaultPlaylist={{
              ...playlistData,
              is_in_playlist: playlistData.recordings.some(
                (rec: any) => rec.id === val.id
              ),
            }}
          />
        ))}
      </SimpleGrid>

      <AlertDialog
        isOpen={confirm.isOpen}
        onClose={confirm.onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Playlist
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={confirm.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={async () => {
                  const res = await backend.delete(
                    '/playlist/delete/' + playlistData.id,
                    {
                      headers: {
                        Authorization: data.token,
                      },
                    }
                  )

                  if (res.status === 200) {
                    confirm.onClose()
                    toast.success('Playlist deleted')
                    router.push('/playlist')
                  }
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
