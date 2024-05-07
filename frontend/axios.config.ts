import axios from 'axios'
import { signOut } from 'next-auth/react'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { BACKEND_API } = publicRuntimeConfig

const backend = axios.create({
  baseURL: BACKEND_API,
})
// Configuring axios default headers
// Add a response interceptor
backend.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    await fetch(process.env.NEXTAUTH_URL + '/api/auth/signout', {
      method: 'POST',
    })
    return error
  }
)
export default backend
