import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Stack,
  StackProps,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaAngleRight, FaHeart, FaPlay } from 'react-icons/fa6'
import backend from '../../axios.config'
import useAudioPlayer from '../../utils/useAudioPlayer'

type PieceData = {
  id: number
  title: string
  composer: string
  duration: string
  image_url: string
  file_url: string
  liked: boolean
}

type Props = {
  pieceData: PieceData
  request?: boolean
  setUpdated: Function
  variant: string
  key?: number
}

const PieceCard: any = (props: Props) => {
  const router = useRouter()
  const pieceData = props.pieceData
  const { data }: any = useSession()
  const audioPlayer = useAudioPlayer()
  const [hover, setHover] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [isLiked, setLiked] = useState<boolean>(pieceData.liked)
  if (!pieceData) return <Skeleton />

  useEffect(() => {
    const fetchPlaylist = async () => {
      const res = await backend.get('/playlist/my-playlists', {
        headers: {
          Authorization: data.token,
        },
      })

      setPlaylists(res.data)
    }

    fetchPlaylist()
  }, [])

  if (props.variant && props.variant == 'pl') {
    return (
      <Grid
        templateRows={{ base: 'auto auto', md: 'auto' }}
        w="100%"
        templateColumns={{ base: 'unset', md: '1fr 8fr 1fr 1fr' }}
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
              <Popover placement="right">
                <PopoverTrigger>
                  <Button variant={'ghost'} w={'100%'}>
                    Add/Remove to playlist
                    <FaAngleRight />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <VStack>
                      {playlists.map((value: any, key: number) => (
                        <Button
                          variant={'link'}
                          onClick={async () => {
                            const res = await backend.post(
                              '/playlist/add-recording/' +
                                value.id +
                                '/' +
                                pieceData.id,
                              {},
                              {
                                headers: {
                                  Authorization: data.token,
                                },
                              }
                            )
                            if (res.data.message == 'Unauthorized') {
                              toast.error('An error has occurred!')
                              return
                            }
                            toast.success(res.data.message)
                          }}
                        >
                          {value.name}
                        </Button>
                      ))}
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
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

  if (props.variant && props.variant == 'sm') {
    return (
      <Flex justifyContent="space-between" px={2}>
        <Flex>
          <IconButton
            aria-label={'Play'}
            icon={<FaPlay />}
            w={4}
            h={8}
            variant={'ghost'}
            onClick={() => {
              audioPlayer.setCurrent(pieceData)
            }}
          />
          <Stack spacing={2} pl={3} align="left" textAlign={'left'}>
            <Heading fontSize="lg">{pieceData.title}</Heading>
          </Stack>
        </Flex>
        <Stack ml={2}>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label={'Settings'}
                icon={<BsThreeDotsVertical />}
                variant={'ghost'}
              />
            </PopoverTrigger>
            <PopoverContent w={'11em'}>
              <PopoverBody>
                <Button
                  variant={'ghost'}
                  w={'100%'}
                  onClick={async () => {
                    console.log(data.backend_session)
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
                    if (props.request) {
                      props.setUpdated(true)
                    }
                  }}
                >
                  Like
                </Button>
                <Popover placement="right">
                  <PopoverTrigger>
                    <Button variant={'ghost'} w={'100%'}>
                      Add/Remove to playlist
                      <FaAngleRight />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent w={'11em'}>
                    <PopoverBody>
                      <VStack>
                        {playlists.map((value: any, key: number) => (
                          <Button
                            variant={'link'}
                            onClick={async () => {
                              const res = await backend.post(
                                '/playlist/add-recording/' +
                                  value.id +
                                  '/' +
                                  pieceData.id,
                                {},
                                {
                                  headers: {
                                    Authorization: data.token,
                                  },
                                }
                              )
                              if (res.data.message == 'Unauthorized') {
                                toast.error('An error has occurred!')
                                return
                              }
                              toast.success(res.data.message)
                            }}
                          >
                            {value.name}
                          </Button>
                        ))}
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
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
        </Stack>
      </Flex>
    )
  }

  return (
    <Box
      px={4}
      py={5}
      w={'auto'}
      borderWidth="1px"
      _hover={{ shadow: 'lg' }}
      bg={useColorModeValue('white', 'gray.800')}
      position="relative"
      rounded="md"
    >
      <Flex justifyContent="space-between">
        <Grid templateColumns="repeat(5, 1fr)">
          <GridItem>
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
          </GridItem>
          <GridItem colSpan={4}>
            <Stack spacing={2} pl={3} align="left">
              <Heading fontSize="lg">{pieceData.title}</Heading>
              <Heading fontSize="sm">{pieceData.composer}</Heading>
            </Stack>
          </GridItem>
        </Grid>
        <Stack display={['none', 'none', 'flex', 'flex']}>
          <Text fontSize={14} color="gray.400">
            {pieceData.duration}
          </Text>
        </Stack>
        <Stack ml={2}>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label={'Settings'}
                icon={<BsThreeDotsVertical />}
                variant={'ghost'}
              ></IconButton>
            </PopoverTrigger>
            <PopoverContent w={'11em'}>
              <PopoverBody>
                <Button
                  variant={'ghost'}
                  w={'100%'}
                  onClick={async () => {
                    console.log(data.backend_session)

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
                    if (props.request) {
                      props.setUpdated(true)
                    }
                  }}
                >
                  Like
                </Button>
                <Popover placement="right">
                  <PopoverTrigger>
                    <Button variant={'ghost'} w={'100%'}>
                      Add/Remove to playlist
                      <FaAngleRight />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverBody>
                      <VStack>
                        {playlists.map((value: any, key: number) => (
                          <Button
                            variant={'link'}
                            onClick={async () => {
                              const res = await backend.post(
                                '/playlist/add-recording/' +
                                  value.id +
                                  '/' +
                                  pieceData.id,
                                {},
                                {
                                  headers: {
                                    Authorization: data.token,
                                  },
                                }
                              )
                              if (res.data.message == 'Unauthorized') {
                                toast.error('An error has occurred!')
                                return
                              }
                              toast.success(res.data.message)
                            }}
                          >
                            {value.name}
                          </Button>
                        ))}
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
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
        </Stack>
      </Flex>
      <Tags
        skills={[pieceData.composer]}
        display={['flex', 'flex', 'none', 'none']}
      />
    </Box>
  )
}

interface TagsProps extends StackProps {
  skills: string[]
}

const Tags = ({ skills, ...props }: TagsProps) => {
  return (
    <Stack spacing={1} mt={3} alignItems="center" flexWrap="wrap" {...props}>
      {skills.map((skill) => (
        <Tag key={skill} m="2px" size="sm">
          {skill}
        </Tag>
      ))}
    </Stack>
  )
}
export default PieceCard
