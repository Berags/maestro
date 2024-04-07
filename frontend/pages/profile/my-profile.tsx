import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import {
  Avatar,
  Box,
  Center,
  Container,
  Flex,
  SimpleGrid,
  color,
} from '@chakra-ui/react'
import { useState } from 'react'
import { MotionBox, MotionFlex } from '../../components/profile/Motion'
import Header from '../../components/profile/Header'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'
import PlaylistCard from '../../components/PlaylistCard'
import Separator from '../../components/Separator'
import axios from "axios";

const Profile: any = () => {
  const router = useRouter()
  const ANIMATION_DURATION = 0.2
  const color = 'blue.400'
  const { data }: any = useSession()

  if (!data) {
    return <>loading</>
  }

  console.table(data)

  return (
    <>
      <Container maxW="5xl" p={{ base: 5, md: 12 }}>
        <Flex direction={['column', 'column', 'row']}>
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
                duration: ANIMATION_DURATION,
              },
            }}
            m="auto"
            mb={[16, 16, 'auto']}
          >
            <Avatar
              size="2xl"
              showBorder={true}
              borderColor={color}
              src={data.user.image}
            />
          </MotionBox>
          <MotionFlex
            position="relative"
            ml={['auto', 'auto', 16]}
            m={['auto', 'initial']}
            w={['90%', '85%', '80%']}
            maxW="800px"
            opacity="0"
            justifyContent="center"
            direction="column"
            initial={{
              opacity: 0,
              translateX: 150,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
              transition: {
                duration: ANIMATION_DURATION,
              },
            }}
          >
            <Box position="relative">
              <Header
                underlineColor={color}
                mt={0}
                cursor="pointer"
                width="max-content"
              >
                {data.user.name}
              </Header>
            </Box>
            <Box as="h2" fontSize="2xl" fontWeight="400" textAlign="left">
              your short description
            </Box>
          </MotionFlex>
        </Flex>
      </Container>
      <Separator text="My playlists" />
      <Container maxW={'8xl'}>
        <SimpleGrid minChildWidth="350px">
          <PlaylistCard />
          <PlaylistCard />
          <PlaylistCard />
          <PlaylistCard />
        </SimpleGrid>
      </Container>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: '/' } }
  }

  console.log(session)

  const res = await axios.get(process.env.BACKEND_API + `/auth/identity?id=${(session.provider == 'github' ? 'gh' : 'ds') + session.accountId}`)

  return {
    props: { session: session ?? [] },
  }
}

export default Profile
