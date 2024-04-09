import * as React from 'react'
import {
  chakra,
  HStack,
  VStack,
  Text,
  Tag,
  Image,
  useColorModeValue,
  Box,
  Menu,
  MenuButton,
  Button,
  MenuList,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import axios from 'axios'
import { useEffect } from 'react'
import getConfig from 'next/config'
import { useSession } from 'next-auth/react'
import PieceCard from '../search/PieceCard'

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
  const { publicRuntimeConfig } = getConfig()
  const { data }: any = useSession()
  const { BACKEND_API } = publicRuntimeConfig
  const [recordings, setRecordings] = React.useState([])
  const router = useRouter()

  useEffect(() => {
    const getRecordings = async () => {
      const res = await axios.get(
        BACKEND_API + `/recording/by-opus/` + opusData.id,
        {
          headers: {
            session: data.backend_session,
          },
        }
      )

      setRecordings(res.data)
      console.log(res.data)
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
          <Image
            src={'https://via.placeholder.com/150'}
            width={33}
            height={33}
            rounded="md"
            objectFit="cover"
            alt="cover image"
            fallbackSrc="https://dummyimage.com/400x400/"
          />
          <VStack align="start" justifyContent="flex-start">
            <VStack spacing={0} align="start">
              <HStack>
                <Text
                  as={Link}
                  href={''}
                  fontWeight="bold"
                  fontSize="md"
                  noOfLines={1}
                  onClick={(e) => e.stopPropagation()}
                >
                  {opusData.title.length > 40
                    ? opusData.title.slice(0, 40).concat('...')
                    : opusData.title}
                </Text>
                <HStack spacing="1">
                  <Tag size="sm" colorScheme="gray">
                    {opusData.genre}
                  </Tag>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </HStack>
      </MenuButton>
      <MenuList>
        {recordings.length > 0 ? (
          <VStack align="stretch">
            {recordings.map((rec: any) => (
              <PieceCard pieceData={rec} variant={'sm'} />
            ))}
          </VStack>
        ) : (
          <Text textAlign={'center'}>No recording found!</Text>
        )}
      </MenuList>
    </Menu>
  )
}

export default OpusCard
