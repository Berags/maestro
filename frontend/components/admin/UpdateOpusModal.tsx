
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

const UpdateOpusModal = ({ opusId, isOpen, onClose, setUpdated }: any) => {
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
    const getOpus = async () => {
      if (isOpen) {
        const res = await backend.get(`/opus/${opusId}`, {
          headers: {
            Authorization: session.data.token,
          },
        })
        const opus = res.data

        const res_composer = await backend.get(`/composer/id/${opus.composer_id}?page=0`, {
          headers: {
            Authorization: session.data.token,
          },
        })
        const composer = res_composer.data

        const res_recordings = await backend.get(`/recording/by-opus/${opusId}`, {
          headers: {
            Authorization: session.data.token,
          },
        })
        const rec = res_recordings.data

        setTitle(opus.title)
        setDescription(opus.description)
        setGenre(opus.genre)
        setSearchValue(composer.name)
        setComposerId(composer.id)
        setRecordings(rec)
      }
    }
    getOpus()
  }, [opusId, isOpen])

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
                    <Input type='text' placeholder='Don Giovanni' value={title} onChange={(event) => setTitle(event.target.value)} />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Genre</Text></InputLeftAddon>
                    <Input type='text' placeholder='Opera' value={genre} onChange={(event) => setGenre(event.target.value)} />
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
                        value={searchValue}
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
              <VStack spacing={4}>
                {recordings.map((recording, i) => (
                  <Stack direction={['column', 'row']}>
                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Title</Text></InputLeftAddon>
                      <Input type='text' isDisabled value={recording.title} placeholder='Opera' onChange={(event) => {
                        const newRecordings = [...recordings]
                        newRecordings[i].title = event.target.value
                        setRecordings(newRecordings)
                      }} />
                    </InputGroup>
                    <IconButton aria-label="Remove" icon={<DeleteIcon />} isDisabled colorScheme={"red"} onClick={() => {
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
            if (!title || !description || !genre || !composerId) {
              reject({ status: 400 })
              return
            }

            const res: any = await backend.put('/admin/opus/update/' + opusId, {
              title,
              genre,
              description,
              composer_id: composerId,
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
            success: { title: 'Opus Updated!', description: 'Looks great' },
            error: { title: 'Unable to update the opus', description: 'Please fill all the fields' },
            loading: { title: 'Updating', description: 'Please wait' },
          })
        }}>Update</Button>
      </ModalFooter>
    </ModalContent>
  </Modal >
}

export default UpdateOpusModal
