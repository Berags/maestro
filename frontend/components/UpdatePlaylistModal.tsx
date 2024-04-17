import {
  Box,
  Button,
  Editable,
  EditablePreview,
  EditableTextarea,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ImageUploading from 'react-images-uploading'
import backend from '../axios.config'

type Props = {
  disclosure: UseDisclosureReturn
  update: any
}

const UpdatePlaylistModal = ({ disclosure, update }: Props) => {
  const { data }: any = useSession()
  const router = useRouter()
  const [image, setImage]: any = useState([update.image_url])
  const [description, setDescription]: any = useState(update.description)
  const [title, setTitle] = useState(update.name)

  const create = async () => {
    const res = await backend.put(
      '/playlist/update/' + update.id,
      {
        title,
        description,
        image_url: update.image_url,
        pinned: update.pinned,
      },
      {
        headers: {
          Authorization: data.token,
        },
      }
    )

    toast.success(res.data.message)
    router.reload()
    disclosure.onClose()
  }

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Playlist name"
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              value={title}
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              borderRadius={6}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              placeholder="Description"
              size="sm"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={disclosure.onClose}>
            Close
          </Button>
          <Button colorScheme="blue" ml={3} onClick={create}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdatePlaylistModal
