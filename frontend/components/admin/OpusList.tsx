import { Box, Button, chakra, Divider, Input, InputGroup, InputLeftElement, SimpleGrid, Skeleton, Stack, useDisclosure } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { Search2Icon } from '@chakra-ui/icons'
import { useEffect, useState } from "react"
import { IoAdd, IoSearch } from "react-icons/io5"
import backend from "../../axios.config"
import Pagination from "../Pagination"
import OpusPiece from "./OpusPiece"

const OpusList = () => {
  const session: any = useSession()
  const [page, setPage] = useState<number>(0)
  const [nOfPages, setNOfPages] = useState<number>(0)
  const [opuses, setOpuses] = useState([])
  const [search, setSearch] = useState('')
  const [updated, setUpdated] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!session) return <Skeleton />

  useEffect(() => {
    const getNOfPages = async () => {
      const res = await backend.get(`/opus/info/pages?query=${search}`, {
        headers: {
          Authorization: session.data.token,
        },
      })

      setNOfPages(res.data.n_of_pages)
    }

    getNOfPages()
  }, [search])

  useEffect(() => {
    const getComposers = async () => {
      if (session.data) {
        const res_pages = await backend({
          method: 'get',
          url: '/opus/?page=' + page + '&query=' + search,
          headers: {
            Authorization: session.data.token,
          },
        })
        setOpuses(res_pages.data)
      }
    }

    getComposers()
    setUpdated(false)
  }, [search, page, updated])

  return (
    <Box>
      <Stack direction={['column', 'row']} justify="space-between" mb={{ base: 4, md: 1 }} px={2} spacing={4}>
        <chakra.h2 fontSize="2xl" fontWeight="bold" mb={2}>
          Opuses
        </chakra.h2>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <Search2Icon color='gray.300' />
          </InputLeftElement>
          <Input type='text' placeholder='Search' value={search} onChange={(event) => setSearch(event.target.value)} />
        </InputGroup>
        <Button colorScheme={"green"} leftIcon={<IoAdd />} onClick={onOpen}>New</Button>
      </Stack>
      <Divider />
      <SimpleGrid
        columns={[1]}
        mb={5}
        justifyItems={'center'}
      >
        {opuses.map((val, i) => (
          <OpusPiece opus={val} index={i} setUpdated={setUpdated} />
        ))}
      </SimpleGrid>
      <Pagination index={page} nOfPages={nOfPages} setPage={setPage} />
    </Box>
  )
}

export default OpusList
