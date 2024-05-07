import { Box, Button, chakra, Divider, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Skeleton, Stack, useDisclosure } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { IoAdd } from "react-icons/io5"
import backend from "../../axios.config"
import Pagination from "../Pagination"
import ComposerPiece from "./ComposerPiece"
import CreateNewComposerModal from "./CreateNewComposerModal"

const ComposerList = () => {
  const session: any = useSession()
  const [page, setPage] = useState<number>(0)
  const [nOfPages, setNOfPages] = useState<number>(0)
  const [composers, setComposers] = useState([])
  const [updated, setUpdated] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!session) return <Skeleton />

  useEffect(() => {
    const getNOfPages = async () => {
      const res = await backend.get(`/composer/pages`, {
        headers: {
          Authorization: session.data.token,
        },
      })

      setNOfPages(res.data.n_of_pages)
    }

    getNOfPages()
  }, [session])

  useEffect(() => {
    const getComposers = async () => {
      if (session.data) {
        const res_pages = await backend({
          method: 'get',
          url: '/composer/?page=' + page,
          headers: {
            Authorization: session.data.token,
          },
        })
        setComposers(res_pages.data)
      }
    }

    getComposers()
    setUpdated(false)
  }, [page, session, updated])

  return (
    <Box>
      <Stack direction={['column', 'row']} justify="space-between" mb={{ base: 4, md: 1 }} px={2}>
        <chakra.h2 fontSize="2xl" fontWeight="bold" mb={5}>
          Composers
        </chakra.h2>
        <Button colorScheme={"green"} leftIcon={<IoAdd />} onClick={onOpen}>New</Button>
      </Stack>
      <CreateNewComposerModal onClose={onClose} isOpen={isOpen} setUpdated={setUpdated} />
      <Divider />
      <SimpleGrid
        columns={[1]}
        mb={5}
        justifyItems={'center'}
      >
        {composers.map((val, i) => (
          <ComposerPiece composer={val} index={i} setUpdated={setUpdated} />
        ))}
      </SimpleGrid>
      <Pagination index={page} nOfPages={nOfPages} setPage={setPage} />
    </Box>
  )
}

export default ComposerList
