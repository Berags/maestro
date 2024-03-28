import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import NotLoggedIn from '../../components/auth/NotLoggedIn'

const Profile: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  if(!session) {
    return <NotLoggedIn />
  }

  return <>Signed in, you can access the page!</>
}

export default Profile
