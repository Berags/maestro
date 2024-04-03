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
  performerData: PerformerData
}

type PerformerData = {
  name: string
  period: string
  shortDescription: string
  img: string
}

const PerformerCard = (props: Props) => {
  const performerData = props.performerData
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
              src={performerData.img}
            />
          </Box>
        </motion.div>
        <Heading
          fontSize="xl"
          fontFamily="body"
          textTransform="capitalize"
          noOfLines={2}
        >
          {performerData.name}
        </Heading>
        <Text
          color="gray.500"
          fontSize="lg"
          noOfLines={{ base: 3, md: 4 }}
          _groupHover={{ display: 'none' }}
          display="block"
        >
          {performerData.period}
        </Text>
        <Fade in>
          <Text
            color="gray.500"
            fontSize="lg"
            noOfLines={{ base: 3, md: 4 }}
            _groupHover={{ display: 'block' }}
            display="none"
          >
            {performerData.shortDescription}
          </Text>
        </Fade>
      </VStack>
    </Box>
  )
}

export default PerformerCard
