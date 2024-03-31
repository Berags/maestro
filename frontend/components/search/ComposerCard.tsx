import * as React from 'react'
import { Box, Text, Heading, Avatar, VStack, Fade } from '@chakra-ui/react'
// Here we have used framer-motion package for animations
import { motion } from 'framer-motion'

const iconProps = {
  variant: 'ghost',
  size: 'lg',
  isRound: true,
}

type Props = {
  composerData: ComposerData
}

type ComposerData = {
  name: string
  period: string
  shortDescription: string
  img: string
}

const ComposerCard = (props: Props) => {
  const composerData = props.composerData
  return (
    <Box
      maxH="400px"
      minH="354px"
      w="250px"
      boxShadow="lg"
      rounded="md"
      p={6}
      overflow="hidden"
      cursor="pointer"
      _hover={{ boxShadow: 'lg' }}
      role="group"
    >
      <VStack spacing={5}>
        <motion.div whileHover={{ y: -5, scale: 1.1 }}>
          <Box boxShadow="xl" _hover={{ boxShadow: 'lg' }} borderRadius="full">
            <Avatar
              _groupHover={{ width: '5rem', height: '5rem' }}
              size="xl"
              src={composerData.img}
            />
          </Box>
        </motion.div>
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
          _groupHover={{ display: 'none' }}
          display="block"
        >
          {composerData.period}
        </Text>
        <Fade in>
          <Text
            color="gray.500"
            fontSize="lg"
            noOfLines={{ base: 3, md: 4 }}
            _groupHover={{ display: 'block' }}
            display="none"
          >
            {composerData.shortDescription}
          </Text>
        </Fade>
      </VStack>
    </Box>
  )
}

export default ComposerCard
