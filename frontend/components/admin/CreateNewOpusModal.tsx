import { Modal, ModalOverlay, useToast, Text, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Textarea, VStack, Button, ModalFooter, Avatar, HStack, Stack, Grid, IconButton } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { DeleteIcon } from "@chakra-ui/icons"
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteGroup,
  AutoCompleteItem,
} from '@choc-ui/chakra-autocomplete'
import backend from "../../axios.config"
import UploadFile from "../UploadFile"
import { useSession } from "next-auth/react"
import UploadAudio from "./UploadAudio"

const CreateNewOpusModal = ({ isOpen, onClose, setUpdated }: any) => {
  const toast = useToast()
  const session: any = useSession()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [composerId, setComposerId] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [cover, setCover] = useState<any>()
  const [recordings, setRecordings] = useState<any[]>([])

  const [composersDataSearch, setComposersDataSearch] = useState<any[]>([])

  useEffect(() => {
    const getResults = async () => {
      const res = await backend.get('/search?query=' + searchValue, {
        headers: {
          Authorization: session.data.token,
        },
      })
      if (res.data) {
        setComposersDataSearch(res.data.composers.hits)
      }
    }

    getResults()
  }, [searchValue])

  return <Modal isOpen={isOpen} onClose={onClose} size="full">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create New Opus</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Accordion>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  Main informations
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <FormControl isRequired>
                <VStack spacing={2}>
                  <InputGroup>
                    <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Title</Text></InputLeftAddon>
                    <Input type='text' placeholder='Don Giovanni' onChange={(event) => setTitle(event.target.value)} />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Genre</Text></InputLeftAddon>
                    <Input type='text' placeholder='Opera' onChange={(event) => setGenre(event.target.value)} />
                  </InputGroup>
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder='Short description' />
                  </FormControl>
                  <AutoComplete rollNavigation maxSuggestions={1}>
                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Composer</Text></InputLeftAddon>
                      <AutoCompleteInput
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search"
                        autoFocus
                      />
                    </InputGroup>
                    <AutoCompleteList>
                      {composersDataSearch.map((composer: any, oid) => (
                        <AutoCompleteItem
                          key={`composers-${oid}`}
                          value={composer.name}
                          textTransform="capitalize"
                          align="center"
                          onClick={() => {
                            setComposerId(composer.id)
                          }}
                        >
                          <Avatar size="sm" name={composer.name} src={composer.portrait} />
                          <Text ml="4">{composer.name}</Text>
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteList>
                  </AutoComplete>
                  <VStack>
                    <Text>Cover</Text>
                    <UploadFile setImage={setCover} />
                  </VStack>
                </VStack>
              </FormControl>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                Recordings
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Button colorScheme={"green"} onClick={() => {
                setRecordings([...recordings, { id: Math.random() }])
              }}>Add</Button>
              <VStack spacing={4}>
                {recordings.map((recording, i) => (
                  <Stack direction={['column', 'row']}>
                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Title</Text></InputLeftAddon>
                      <Input type='text' placeholder='Opera' onChange={(event) => {
                        const newRecordings = [...recordings]
                        newRecordings[i].title = event.target.value
                        setRecordings(newRecordings)
                      }} />
                    </InputGroup>
                    <VStack>
                      <UploadAudio setFile={(file: any) => {
                        const newRecordings = [...recordings]
                        newRecordings[i].file = file
                        setRecordings(newRecordings)
                      }} />
                    </VStack>
                    <IconButton aria-label="Remove" icon={<DeleteIcon />} colorScheme={"red"} onClick={() => {
                      const newRecordings = [...recordings]
                      newRecordings.splice(i, 1)
                      setRecordings(newRecordings)
                    }} />
                  </Stack>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </ModalBody>
      <ModalFooter>
        <Button variant='ghost' mr={3} onClick={onClose}>
          Close
        </Button>
        <Button colorScheme={"green"} onClick={() => {
          const createOpus = new Promise(async (resolve, reject) => {
            if (!title || !description || !genre || !composerId || !cover || !recordings) {
              reject({ status: 400 })
              return
            }

            const formData = new FormData()
            formData.append('image', cover.file, title)
            const res_image = await backend.post('/admin/opus/upload-image', formData, {
              headers: {
                Authorization: session.data.token,
                'Content-Type': 'multipart/form-data;',
              },
            })
            const image_url = res_image.data.url
            const uploadRecordings = recordings
            await Promise.all(recordings.map(async (recording, i) => {
              const formDataOpus = new FormData()
              formDataOpus.append('audio', recording.file, recording.title)

              const audio_url = await backend.post('/admin/opus/upload-audio', formDataOpus, {
                headers: {
                  Authorization: session.data.token,
                  'Content-Type': 'multipart/form-data;',
                },
              })
              const newRecordings = [...recordings]
              newRecordings[i].file_url = audio_url.data.url
              uploadRecordings[i] = newRecordings[i]
            }))

            const res: any = await backend.post('/admin/opus/create', {
              title,
              genre,
              description,
              composer_id: composerId,
              cover: image_url,
              recordings: uploadRecordings
            }, {
              headers: {
                Authorization: session.data.token,
              },
            })
            if (res.status === 200) {
              resolve(res)
              setUpdated(true)
              onClose()
            } else {
              reject(res)
            }
          })
          toast.promise(createOpus, {
            success: { title: 'Opus Created!', description: 'Looks great' },
            error: { title: 'Unable to create Opus', description: 'Please fill all the fields' },
            loading: { title: 'Uploading', description: 'Please wait' },
          })
        }}>Create</Button>
      </ModalFooter>
    </ModalContent>
  </Modal >
}

export default CreateNewOpusModal
