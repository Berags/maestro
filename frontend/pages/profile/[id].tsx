import { Center } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Profile: any = () => {
  const router = useRouter()
  const { data }: any = useSession()

  if (!data) {
    return <>loading</>
  }

  return (
    <>
      <Center>This is your profile {router.query.id}</Center>
    </>
  )
}

/*export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  /*if (!session) {
      return { redirect: { destination: '/' } }
    }
    console.log(session.user)

    return {
      props: { session: session ?? [] },
    }
}*/

export default Profile
