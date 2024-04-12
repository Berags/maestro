import axios from 'axios'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { BACKEND_API } = publicRuntimeConfig

const backend = axios.create({
  baseURL: BACKEND_API,
})

export default backend
