import React from 'react'
import {
  Box,
  Button,
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
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaAngleRight, FaCheck, FaPlay, FaPlus } from 'react-icons/fa6'
import backend from '../../axios.config'
import useAudioPlayer from '../../utils/useAudioPlayer'

const DefaultPieceCard = (props: any) => {
  const [hover, setHover] = useState(false)
  const { pieceData, playlists } = props
  const audioPlayer = useAudioPlayer()
  const { data }: any = useSession()

  return <Box
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
      {props.variant == 'sg' ? (
        <>
          {props.defaultPlaylist.is_in_playlist ? (
            <IconButton
              variant={'link'}
              aria-label={'Added to playlist'}
              icon={<FaCheck />}
            />
          ) : (
            <IconButton
              variant={'ghost'}
              icon={<FaPlus />}
              aria-label={'Add to playlist'}
              onClick={async () => {
                const res = await backend.post(
                  '/playlist/add-recording/' +
                  props.defaultPlaylist.id +
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
                props.setUpdated(true)
              }}
            />
          )}
        </>
      ) : (
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
                      Add to playlist
                      <FaAngleRight />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverBody>
                      <VStack>
                        {playlists && playlists.map((value: any, key: number) => (
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
                            key={key}
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
      )}
    </Flex>
  </Box>
}

export default DefaultPieceCard
