import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  Link,
} from '@chakra-ui/react'
import { IconContext } from 'react-icons'
import { TbPlayerPlayFilled } from 'react-icons/tb'
import { MotionBox } from './profile/Motion'

type Props = {
  key: any
  playlist: any
}

const PlaylistCard = ({ key, playlist }: Props) => {
  return (
    <Link href={'/playlist/' + playlist.id}>
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
          key={key}
        >
          <Image
            w="full"
            h={56}
            fit="cover"
            rounded="lg"
            overflow="hidden"
            mx="auto"
            src={playlist.image_url}
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
              <Heading as={'h3'} size={'lg'} noOfLines={[1]}>
                {playlist.name}
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
    </Link>
  )
}

export default PlaylistCard
