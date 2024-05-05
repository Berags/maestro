// Nextjs page that allows an admin to create a new opus
// The page contains a form that takes in the title, description, and image of the opus
// The form also allows the admin to upload an image for the opus
// The form is submitted to the backend to create the opus
// It allow to add recordings to the opus

import { Box, chakra, Flex, HStack, Button, Avatar, Tabs, TabList, Tab, Spacer, TabPanels, TabPanel } from "@chakra-ui/react"
import { GetServerSidePropsContext } from "next"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { IoArrowBack } from "react-icons/io5"
import backend from "../../axios.config"
import ComposersList from "../../components/admin/ComposersList"
import { authOptions } from "../api/auth/[...nextauth]"

const Dashboard = ({ user }: any) => {
  return (
    <Box>
      <chakra.header
        borderColor="gray.600"
        borderBottomWidth={1}
        w="full"
        px={4}
        py={4}
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <HStack spacing={4} display="flex" alignItems="center">
            <Link href="/home">
              <Button leftIcon={<IoArrowBack />}>Maestro</Button>
            </Link>
            <chakra.h2 fontSize="xl" fontWeight="bold">
              Admin Dashboard
            </chakra.h2>
          </HStack>
          <HStack spacing={3} display="flex" alignItems="center">
            <Avatar
              size="sm"
              name={user.name}
              src={user.image}
            />
          </HStack>
        </Flex>
      </chakra.header>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mx={2}
        borderWidth={0}
        overflowX="auto"
      >
        <Tabs borderBottomColor="transparent">
          <TabList>
            <Tab
              py={4}
              m={0}
              _focus={{
                boxShadow: "none",
              }}
            >
              Composers
            </Tab>
            <Tab
              py={4}
              m={0}
              _focus={{
                boxShadow: "none",
              }}
            >
              Opuses
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel w={"100vw"} px={{ base: 8, sm: 16, md: 32 }}><ComposersList /></TabPanel>
          </TabPanels>
        </Tabs>
        <Spacer />
      </Flex>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is not logged in, redirect.
  if (!session) {
    return { redirect: { destination: '/' } }
  }

  const res = await backend.get(
    `/auth/identity?id=${(session.provider == 'github' ? 'gh' : 'ds') + session.accountId
    }`,
    {
      headers: {
        Authorization: session.token,
      },
    }
  )

  if (res.data.is_admin === false) {
    return { redirect: { destination: '/' } }
  }

  return {
    props: {
      session: session ?? [],
      user: res.data,
    },
  }
}

export default Dashboard
