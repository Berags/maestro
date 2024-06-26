import * as React from 'react'
import { Box, Text, Heading, Avatar, VStack, Fade } from '@chakra-ui/react'
// Here we have used framer-motion package for animations
import { motion } from 'framer-motion'
import Link from 'next/link'

const iconProps = {
  variant: 'ghost',
  size: 'lg',
  isRound: true,
}

type Props = {
  composerData: ComposerData
}

type ComposerData = {
  id: number
  name: string
  epoch: string
  short_description: string
  portrait: string
}

const ComposerCard = (props: Props) => {
  const composerData = props.composerData
  return (
    <Link href={'/composer/' + composerData.id}>
      <Box
        maxH="400px"
        minH="154px"
        w="250px"
        height={'280px'}
        boxShadow="lg"
        rounded="md"
        p={6}
        overflow="hidden"
        bg={'white'}
        cursor="pointer"
        _hover={{ boxShadow: 'lg' }}
        role="group"
      >
        <VStack spacing={5}>
          <Box boxShadow="xl" _hover={{ boxShadow: 'lg' }} borderRadius="full">
            <Avatar
              _groupHover={{ width: '7rem', height: '7rem' }}
              size="xl"
              src={composerData.portrait}
            />
          </Box>
          <Heading
            fontSize="xl"
            fontFamily="body"
            textTransform="capitalize"
            noOfLines={2}
          >
            {composerData.name}
          </Heading>
          <Text
            color="gray.500"
            fontSize="lg"
            noOfLines={{ base: 3, md: 4 }}
            display="block"
          >
            {composerData.epoch}
          </Text>
        </VStack>
      </Box>
    </Link>
  )
}

export default ComposerCard
