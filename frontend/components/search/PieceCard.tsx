import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Image,
  useColorModeValue,
  Tag,
  StackProps,
  Skeleton,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react'
import useAudioPlayer from '../../utils/useAudioPlayer'
import { BsThreeDotsVertical } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { FaPlay } from 'react-icons/fa6'

type PieceData = {
  id: number
  title: string
  composer: string
  duration: string
  image_url: string
  file_url: string
}

type Props = {
  pieceData: PieceData
  variant: string
}

const PieceCard: any = (props: Props) => {
  const pieceData = props.pieceData
  const audioPlayer = useAudioPlayer()
  if (!pieceData) return <Skeleton />

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
          <Stack spacing={2} pl={3} align="left" textAlign={'center'}>
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
            <PopoverContent w={'10em'}>
              <PopoverBody>
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
        <Flex>
          <Image
            w={16}
            h={16}
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/150"
            src={pieceData.image_url}
            alt={pieceData.title}
            onClick={() => {
              audioPlayer.setCurrent(pieceData)
            }}
          />
          <Stack spacing={2} pl={3} align="left">
            <Heading fontSize="lg">{pieceData.title}</Heading>
            <Heading fontSize="sm">{pieceData.composer}</Heading>
            <Tags
              skills={['Performer']}
              display={['none', 'none', 'flex', 'flex']}
            />
          </Stack>
        </Flex>
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
              >
                sdas
              </IconButton>
            </PopoverTrigger>
            <PopoverContent w={'10em'}>
              <PopoverBody>
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
      <Tags skills={['Performer']} display={['flex', 'flex', 'none', 'none']} />
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
