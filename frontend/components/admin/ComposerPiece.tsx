import { Avatar, Box, chakra, Grid, HStack, IconButton, Stack, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { Fragment } from "react"
import { IoPencil, IoTrashBin } from "react-icons/io5"
import backend from "../../axios.config"
import UpdateComposerModal from "./UpdateComposerModal"

const ComposerPiece = ({ composer, index, setUpdated }: any) => {
  const session: any = useSession()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const deleteComposer = async () => {
    const res = await backend.delete(`/composer/id/${composer.id}`, {
      headers: {
        Authorization: session.data.token,
      },
    })

    if (res.status === 200) {
      toast({
        title: 'Composer deleted.',
        description: composer.name + " successfully deleted",
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
            <Avatar display={{ base: "none", md: "inline" }} name={composer.name} src={composer.portrait} />
            <chakra.p>{composer.name}</chakra.p>
          </HStack>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          fontSize={{ base: 'sm', sm: 'md' }}
          justifySelf="flex-end"
          alignItems="center"
        >
          <UpdateComposerModal onClose={onClose} isOpen={isOpen} setUpdated={setUpdated} composerId={composer.id} />
          <IconButton aria-label="edit" icon={<IoPencil />} onClick={onOpen} />
          <IconButton aria-label="delete" icon={<IoTrashBin />} onClick={deleteComposer} />
        </Stack>
      </Grid>
    </Fragment>
  )
}

export default ComposerPiece
