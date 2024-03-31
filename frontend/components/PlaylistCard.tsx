import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Grid,
  GridItem,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { NextComponentType } from 'next'
import Link from 'next/link'
import { IconContext } from 'react-icons'
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from 'react-icons/tb'
import { MotionBox } from './profile/Motion'

const PlaylistCard: NextComponentType = () => {
  return (
    <MotionBox
      opacity="0"
      initial={{
        translateX: -150,
        opacity: 0,
      }}
      animate={{
        translateX: 0,
        opacity: 1,
        transition: {
          duration: 0.2,
        },
      }}
      m="auto"
      mb={[16, 16, 'auto']}
    >
      <Box
        px={4}
        py={2}
        w={280}
        _hover={{ shadow: 'lg' }}
        shadow={'md'}
        position="relative"
        rounded="lg"
        overflow="hidden"
        mx="auto"
      >
        <Image
          w="full"
          h={56}
          fit="cover"
          rounded="lg"
          overflow="hidden"
          mx="auto"
          src="https://picsum.photos/seed/picsum/400"
          alt="avatar"
        />

        <Grid
          templateColumns="repeat(5, 1fr)"
          py={5}
          px={4}
          textAlign="center"
          verticalAlign={'center'}
        >
          <GridItem colSpan={4}>
            <Heading as={'h3'} size={'lg'}>
              Playlist name
            </Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <Button colorScheme="blue" variant="ghost" onClick={() => {}}>
              <IconContext.Provider value={{ size: '2em', color: '#2B6CB0' }}>
                <TbPlayerPlayFilled />
              </IconContext.Provider>
            </Button>
          </GridItem>
        </Grid>
      </Box>
    </MotionBox>
  )
}

export default PlaylistCard
