import { Button, Flex, Heading, IconButton, Popover, PopoverBody, PopoverContent, PopoverTrigger, Stack, VStack } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FaAngleRight, FaPlay } from "react-icons/fa6"
import backend from "../../axios.config"
import useAudioPlayer from "../../utils/useAudioPlayer"

const SmallPieceCardVariant = (props: any) => {
  const { data }: any = useSession()
  const audioPlayer = useAudioPlayer()
  const { pieceData, request, setUpdated, playlists, } = props
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
                  if (request) {
                    setUpdated(true)
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

export default SmallPieceCardVariant
