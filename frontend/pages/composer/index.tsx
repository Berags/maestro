import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { Center } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../api/auth/[...nextauth]'

const Composers: any = () => {
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: '/' } }
  }


  const res = await axios.get(process.env.BACKEND_API + `/composers`, {
    headers: {
      session: session.backend_session,
    },
  })

  console.log(res.data)

  return {
    props: { session: session ?? [], composerData: res.data },
  }
}

export default Composers
