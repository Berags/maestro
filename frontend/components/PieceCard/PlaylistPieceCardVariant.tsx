import {
  Box,
  Button,
  chakra,
  Grid,
  IconButton,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaHeart, FaPlay, } from 'react-icons/fa6'
import backend from '../../axios.config'
import { useState } from 'react'
import useAudioPlayer from '../../utils/useAudioPlayer'
import { useSession } from 'next-auth/react'

const PlaylistPieceCardVariant = (props: any) => {
  const [hover, setHover] = useState(false)
  const { isLiked, setLiked, pieceData } = props
  const audioPlayer = useAudioPlayer()
  const { data }: any = useSession()
  return (
    <Grid
      templateRows={{ base: 'auto auto', md: 'auto' }}
      w="100%"
      templateColumns={{
        base: '1fr 1fr 1fr 1fr 1fr',
        md: '1fr 8fr 1fr 1fr',
      }}
      p={{ base: 2, sm: 4 }}
      gap={3}
      borderRadius={4}
      alignItems="center"
      _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
    >
      {hover ? (
        <IconButton
          w={16}
          h={16}
          icon={<FaPlay />}
          aria-label={'Play'}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => {
            audioPlayer.setCurrent(pieceData)
          }}
        />
      ) : (
        <Image
          fallbackSrc="https://via.placeholder.com/150"
          src={pieceData.image_url}
          alt={pieceData.title}
          w={16}
          h={16}
          objectFit="cover"
          minH={16}
          minW={16}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => {
            audioPlayer.setCurrent(pieceData)
          }}
        />
      )}
      <Box gridColumnEnd={{ base: 'span 2', md: 'unset' }}>
        <chakra.h3
          as={Link}
          href={'/'}
          fontWeight="bold"
          fontSize="md"
          justifySelf={'left'}
        >
          {pieceData.title}
        </chakra.h3>
      </Box>
      <IconButton
        variant={'link'}
        w={'100%'}
        onClick={async () => {
          const res = await backend.post(
            '/recording/like/' + pieceData.id,
            {},
            {
              headers: {
                Authorization: data.token,
              },
            }
          )
          toast.success(res.data.message)
          setLiked(!isLiked)
          if (props.request) {
            props.setUpdated(true)
          }
        }}
        colorScheme={isLiked ? 'red' : 'gray'}
        icon={<FaHeart />}
        aria-label={'Like'}
      >
        Like
      </IconButton>
      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label={'Settings'}
            icon={<BsThreeDotsVertical />}
            variant={'ghost'}
          ></IconButton>
        </PopoverTrigger>
        <PopoverContent w={'16em'}>
          <PopoverBody>
            <Button
              variant={'ghost'}
              w={'100%'}
              onClick={async () => {
                toast.promise(
                  backend.delete(
                    '/playlist/remove-recording/' +
                    props.defaultPlaylist.id +
                    '/' +
                    pieceData.id,
                    {
                      headers: {
                        Authorization: data.token,
                      },
                    }
                  ),
                  {
                    loading: 'Removing from playlist...',
                    success: 'Removed from playlist!',
                    error: 'Failed to remove from playlist',
                  }
                )
                props.setUpdated(true)
              }}
            >
              Remove from playlist
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => {
                audioPlayer.setQueue([...audioPlayer.queue, pieceData])
                toast.success('Added to queue!')
              }}
              w={'100%'}
            >
              Add to queue
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Grid>
  )
}

export default PlaylistPieceCardVariant
