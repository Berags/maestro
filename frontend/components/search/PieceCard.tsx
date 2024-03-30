import {
  Box,
  Stack,
  VStack,
  Heading,
  Flex,
  Text,
  Image,
  useColorModeValue,
  Container,
  Tag,
  StackProps,
} from '@chakra-ui/react'
import { NextComponentType } from 'next'

const pieceData = {
  title: 'Nocturne in C# minor - op. posth',
  alt: 'company image',
  composer: 'Fryderyk Chopin',
  performers: ['Arthur Rubenstein'],
  duration: '2:57',
  logo: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/fa/f7/54/faf7540e-3346-b548-55d8-8617ce707554/dj.hbpmuqwc.jpg/632x632bb.webp',
}

const PieceCard: NextComponentType = () => {
  return (
    <Box
      px={4}
      py={5}
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
            src={pieceData.logo}
            alt={pieceData.alt}
          />
          <Stack spacing={2} pl={3} align="left">
            <Heading fontSize="xl">{pieceData.title}</Heading>
            <Heading fontSize="sm">{pieceData.composer}</Heading>
            <Tags
              skills={pieceData.performers}
              display={['none', 'none', 'flex', 'flex']}
            />
          </Stack>
        </Flex>
        <Stack display={['none', 'none', 'flex', 'flex']}>
          <Text fontSize={14} color="gray.400">
            {pieceData.duration}
          </Text>
        </Stack>
      </Flex>
      <Tags
        skills={pieceData.performers}
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
    <Stack
      spacing={1}
      mt={3}
      isInline
      alignItems="center"
      flexWrap="wrap"
      {...props}
    >
      {skills.map((skill) => (
        <Tag key={skill} m="2px" size="sm">
          {skill}
        </Tag>
      ))}
    </Stack>
  )
}
export default PieceCard
