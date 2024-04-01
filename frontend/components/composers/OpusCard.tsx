import * as React from 'react'
import {
  chakra,
  HStack,
  VStack,
  Text,
  Tag,
  Link,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'

type Props = {
  opusData: OpusData
}

type OpusData = {
  name: string
  type: string
  shortDescription: string
  duration: string
  image: string
}

const OpusCard = (props: Props) => {
  const opusData = props.opusData
  const textColor = useColorModeValue('gray.500', 'gray.200')
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <>
      <chakra.div onClick={toggleOpen}>
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
            src={opusData.image}
            width={33}
            height={33}
            rounded="md"
            objectFit="cover"
            alt="cover image"
            fallbackSrc="https://via.placeholder.com/150"
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
                  isExternal
                >
                  {opusData.name}
                </Text>
                <HStack spacing="1">
                  <Tag size="sm" colorScheme="gray">
                    {opusData.type}
                  </Tag>
                </HStack>
              </HStack>

              {!isOpen && (
                <Text fontSize="sm" color={textColor} noOfLines={{ base: 2 }}>
                  {opusData.shortDescription}
                </Text>
              )}

              {isOpen && (
                <Text fontSize="sm" color={textColor}>
                  {opusData.shortDescription}
                </Text>
              )}
            </VStack>
          </VStack>
        </HStack>
      </chakra.div>
    </>
  )
}

export default OpusCard
