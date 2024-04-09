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
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
  const textColor = useColorModeValue('gray.500', 'gray.200')
  const router = useRouter()

  return (
    <Box
      key={opusData.id}
      onClick={() => {
        router.push('/opus/' + opusData.id)
      }}
    >
      <HStack
        p={4}
        bg={useColorModeValue('white', 'gray.800')}
        rounded="xl"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
        w="100%"
        h="100%"
        textAlign="left"
        align="start"
        spacing={4}
        cursor="pointer"
        _hover={{ shadow: 'lg' }}
      >
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
                {opusData.title}
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
    </Box>
  )
}

export default OpusCard
