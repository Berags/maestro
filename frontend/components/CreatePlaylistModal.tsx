import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureReturn,
  FormControl,
  FormLabel,
  Input,
  Box,
} from '@chakra-ui/react'
import { useState } from 'react'
import ImageUploading from 'react-images-uploading'
import { useSession } from 'next-auth/react'
import backend from '../axios.config'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

type Props = {
  disclosure: UseDisclosureReturn
}

const CreatePlaylistModal = ({ disclosure }: Props) => {
  const { data }: any = useSession()
  const router = useRouter()
  const [image, setImage]: any = useState([])
  const [title, setTitle] = useState('')

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setImage(imageList)
  }

  const create = async () => {
    const formData = new FormData()
    formData.append('image', image[0].file, title + data.accountId)
    const res_image = await backend.post('/playlist/upload', formData, {
      headers: {
        Authorization: data.token,
        'Content-Type': 'multipart/form-data;',
      },
    })
    const image_url = res_image.data.url
    const res = await backend.post(
      '/playlist/create',
      {
        title,
        image_url,
      },
      {
        headers: {
          Authorization: data.token,
        },
      }
    )

    toast.success(res.data.message)
    disclosure.onClose()
    router.push('/playlist/' + res.data.id)
  }

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Playlist name"
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Image</FormLabel>
            <ImageUploading
              multiple
              value={image}
              onChange={onChange}
              maxNumber={1}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors,
              }) => (
                <div>
                  {image.length <= 0 ? (
                    <Box
                      w="100%"
                      h={'5em'}
                      border={'2px'}
                      borderRadius={6}
                      borderColor={'gray.100'}
                      alignContent={'center'}
                      textAlign={'center'}
                    >
                      <button
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Click or Drop here
                      </button>
                    </Box>
                  ) : null}
                  {errors && (
                    <div>
                      {errors.maxNumber && (
                        <span>Number of selected images exceed maxNumber</span>
                      )}
                      {errors.acceptType && (
                        <span>Your selected file type is not allow</span>
                      )}
                      {errors.maxFileSize && (
                        <span>Selected file size exceed maxFileSize</span>
                      )}
                      {errors.resolution && (
                        <span>
                          Selected file is not match your desired resolution
                          (must be squared)
                        </span>
                      )}
                    </div>
                  )}
                  {imageList.map((image, index) => (
                    <Box
                      key={index}
                      alignContent={'center'}
                      textAlign={'center'}
                    >
                      <img
                        src={image['data_url']}
                        alt=""
                        width="100"
                        style={{
                          display: 'block',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}
                      />
                      <div className="image-item__btn-wrapper">
                        <Button
                          variant={'ghost'}
                          onClick={() => onImageUpdate(index)}
                        >
                          Update
                        </Button>
                        <Button
                          variant={'ghost'}
                          onClick={() => onImageRemove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Box>
                  ))}
                </div>
              )}
            </ImageUploading>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={disclosure.onClose}>
            Close
          </Button>
          <Button colorScheme="blue" ml={3} onClick={create}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreatePlaylistModal
