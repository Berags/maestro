
import { Avatar, Box, chakra, Grid, HStack, IconButton, Stack, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { Fragment } from "react"
import { IoPencil, IoTrashBin } from "react-icons/io5"
import backend from "../../axios.config"
import UpdateOpusModal from "./UpdateOpusModal"

const OpusPiece = ({ opus, index, setUpdated }: any) => {
  const session: any = useSession()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const deleteOpus = async () => {
    const res = await backend.delete(`/opus/id/${opus.id}`, {
      headers: {
        Authorization: session.data.token,
      },
    })

    if (res.status === 200) {
      toast({
        title: 'Opus deleted.',
        description: opus.title + " successfully deleted",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Error.',
        description: "There was an error while processing the request.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setUpdated(true)
  }

  return (
    <Fragment key={index}>
      <UpdateOpusModal opusId={opus.id} isOpen={isOpen} onClose={onClose} setUpdated={setUpdated} />
      <Grid
        w="100%"
        templateColumns={'4fr 2fr 2fr'}
        alignItems="center"
        rounded={'md'}
        p={2}
        _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
      >
        <Box gridColumnEnd={'span 2'}>
          <HStack>
            <chakra.p>{opus.title}</chakra.p>
          </HStack>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          fontSize={{ base: 'sm', sm: 'md' }}
          justifySelf="flex-end"
          alignItems="center"
        >
          <IconButton aria-label="edit" icon={<IoPencil />} onClick={onOpen} />
          <IconButton aria-label="delete" icon={<IoTrashBin />} onClick={deleteOpus} />
        </Stack>
      </Grid>
    </Fragment>
  )
}

export default OpusPiece
