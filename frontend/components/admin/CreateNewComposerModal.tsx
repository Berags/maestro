import { Accordion, AccordionButton, AccordionIcon, AccordionItem, Text, AccordionPanel, Box, Button, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack, FormControl, FormLabel, Textarea, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import backend from "../../axios.config"
import UploadFile from "../UploadFile"

const CreateNewComposerModal = ({ onClose, isOpen, setUpdated }: any) => {
  const { data }: any = useSession()
  const toast = useToast()
  const [name, setName] = useState('')
  const [epoch, setEpoch] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [placeOfBirth, setPlaceOfBirth] = useState('')
  const [dateofDeath, setDateOfDeath] = useState('')
  const [placeOfDeath, setPlaceOfDeath] = useState('')
  const [portrait, setPortrait] = useState<any>()

  const [shortDescription, setShortDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Composer</ModalHeader>
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
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Full Name</Text></InputLeftAddon>
                      <Input type='text' placeholder='John Doe' onChange={(event) => setName(event.target.value)} />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Epoch</Text></InputLeftAddon>
                      <Input type='text' placeholder='Romantic' onChange={(event) => setEpoch(event.target.value)} />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Date of Birth</Text></InputLeftAddon>
                      <Input type='date' onChange={(event) => setDateOfBirth(event.target.value)} />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Place of Birth</Text></InputLeftAddon>
                      <Input type='text' placeholder='Rome' onChange={(event) => setPlaceOfBirth(event.target.value)} />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Date of Death</Text></InputLeftAddon>
                      <Input type='date' onChange={(event) => setDateOfDeath(event.target.value)} />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Place of Death</Text></InputLeftAddon>
                      <Input type='text' placeholder='Rome' onChange={(event) => setPlaceOfDeath(event.target.value)} />
                    </InputGroup>

                    <VStack>
                      <Text>Portrait</Text>
                      <UploadFile setImage={setPortrait} />
                    </VStack>
                  </VStack>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as='span' flex='1' textAlign='left'>
                    Descriptions
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Short Description</FormLabel>
                    <Textarea value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder='Short description' />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Long Description</FormLabel>
                    <Textarea value={longDescription} onChange={(event) => setLongDescription(event.target.value)} placeholder='Short description' />
                  </FormControl>
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
            const createComposer = new Promise(async (resolve, reject) => {
              if (!name || !dateOfBirth || !placeOfBirth || !dateofDeath || !placeOfDeath || !portrait || !shortDescription || !longDescription) {
                reject()
                return
              }
              if (portrait.length <= 0) {
                reject()
                return
              }
              const formData = new FormData()
              formData.append('image', portrait.file, name)
              const res_image = await backend.post('/admin/composer/upload', formData, {
                headers: {
                  Authorization: data.token,
                  'Content-Type': 'multipart/form-data;',
                },
              })
              const image_url = res_image.data.url
              const res = await backend.post("/admin/composer/create", {
                name,
                epoch,
                birth_date: dateOfBirth,
                birth_place: placeOfBirth,
                death_date: dateofDeath,
                death_place: placeOfDeath,
                portrait: image_url,
                short_description: shortDescription,
                long_description: longDescription,
              }, {
                headers: {
                  Authorization: data.token,
                }
              })

              if (res.status === 200) {
                resolve(res)
                setUpdated(true)
                onClose()
              } else {
                reject(res)
              }
            })
            toast.promise(createComposer, {
              success: { title: 'Composer Created!', description: 'Looks great' },
              error: { title: 'Unable to create composer', description: 'Please fill all the fields' },
              loading: { title: 'Promise pending', description: 'Please wait' },
            })
          }}>Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateNewComposerModal
