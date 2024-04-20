import * as React from 'react'
import {
  HStack,
  VStack,
  Text,
  Tag,
  Image,
  useColorModeValue,
  Menu,
  MenuButton,
  Button,
  MenuList,
  Flex,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import getConfig from 'next/config'
import { useSession } from 'next-auth/react'
import PieceCard from '../search/PieceCard'
import backend from '../../axios.config'
import { useWindowSize } from '../../utils/useWindowSize'
import NextLink from 'next/link'
import { MdOutlineOpenInNew } from 'react-icons/md'

type Props = {
  opusData: OpusData
}

type OpusData = {
  id: number
  title: string
  genre: string
  duration: string
  image: string
  recommended: boolean
  popular: boolean
}

const OpusCard = (props: Props) => {
  const opusData = props.opusData
  const size = useWindowSize()
  const { publicRuntimeConfig } = getConfig()
  const { data }: any = useSession()
  const { BACKEND_API } = publicRuntimeConfig
  const [recordings, setRecordings] = React.useState([])
  const router = useRouter()

  useEffect(() => {
    const getRecordings = async () => {
      const res = await backend.get(`/recording/by-opus/` + opusData.id, {
        headers: {
          Authorization: data.token,
        },
      })

      setRecordings(res.data)
    }

    getRecordings()
  }, [opusData])

  return (
    <Menu key={opusData.id}>
      <MenuButton
        as={Button}
        p={4}
        bg={useColorModeValue('white', 'gray.200')}
        rounded="xl"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
        w="100%"
        h="100%"
        cursor="pointer"
        _hover={{ shadow: 'lg' }}
      >
        <HStack textAlign="left" align="start" spacing={4}>
          {size.width > 400 ? (
            <Image
              src={'https://via.placeholder.com/150'}
              width={33}
              height={33}
              rounded="md"
              objectFit="cover"
              alt="cover image"
              fallbackSrc="https://dummyimage.com/400x400/"
            />
          ) : null}
          <VStack align="start" justifyContent="flex-start">
            <VStack spacing={0} align="start">
              <VStack>
                <Text
                  as={Link}
                  href={''}
                  fontWeight="bold"
                  fontSize="md"
                  noOfLines={1}
                  onClick={(e) => e.stopPropagation()}
                >
                  {opusData.title.length > 22
                    ? opusData.title.slice(0, 22).concat('...')
                    : opusData.title}
                </Text>
                <Tag size="sm" colorScheme="gray">
                  {opusData.genre}
                </Tag>
              </VStack>
            </VStack>
          </VStack>
        </HStack>
      </MenuButton>
      <MenuList w={'80%'}>
        <VStack align="stretch">
          {recordings.length > 0 ? (
            recordings.map((rec: any) => (
              <PieceCard pieceData={rec} variant={'sm'} />
            ))
          ) : (
            <Text textAlign={'center'}>No recording found!</Text>
          )}
          <NextLink href={'/opus/' + opusData.id}>
            <HStack textAlign={'center'} justify={'center'}>
              <Text>View</Text>
              <MdOutlineOpenInNew />
            </HStack>
          </NextLink>
        </VStack>
      </MenuList>
    </Menu>
  )
}

export default OpusCard
