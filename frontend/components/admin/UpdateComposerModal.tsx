
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, Text, AccordionPanel, Box, Button, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack, FormControl, FormLabel, Textarea, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import backend from "../../axios.config"

const UpdateComposerModal = ({ onClose, isOpen, setUpdated, composerId }: any) => {
  const { data }: any = useSession()
  const toast = useToast()
  const [name, setName] = useState('')
  const [epoch, setEpoch] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [placeOfBirth, setPlaceOfBirth] = useState('')
  const [dateofDeath, setDateOfDeath] = useState('')
  const [placeOfDeath, setPlaceOfDeath] = useState('')

  const [shortDescription, setShortDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')

  useEffect(() => {
    const getComposer = async () => {
      const res = await backend.get(`/composer/id/${composerId}?page=0`, {
        headers: {
          Authorization: data.token,
        },
      })

      const composer = res.data
      setName(composer.name)
      setEpoch(composer.epoch)
      setDateOfBirth(composer.birth_date.slice(0, 10))
      setPlaceOfBirth(composer.birth_place)
      setDateOfDeath(composer.death_date.slice(0, 10))
      setPlaceOfDeath(composer.death_place)
      setShortDescription(composer.short_description)
      setLongDescription(composer.long_description)
    }

    getComposer()
  }, [composerId, isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader><Text>{name} - {composerId}</Text></ModalHeader>
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
                      <Input type='text' placeholder='John Doe' value={name} onChange={(event) => setName(event.target.value)} />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Epoch</Text></InputLeftAddon>
                      <Input type='text' placeholder='Romantic' value={epoch} onChange={(event) => setEpoch(event.target.value)} />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Date of Birth</Text></InputLeftAddon>
                      <Input type='date' value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Place of Birth</Text></InputLeftAddon>
                      <Input type='text' placeholder='Rome' value={placeOfBirth} onChange={(event) => setPlaceOfBirth(event.target.value)} />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Date of Death</Text></InputLeftAddon>
                      <Input type='date' value={dateofDeath} onChange={(event) => setDateOfDeath(event.target.value)} />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Place of Death</Text></InputLeftAddon>
                      <Input type='text' value={placeOfDeath} placeholder='Rome' onChange={(event) => setPlaceOfDeath(event.target.value)} />
                    </InputGroup>
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
              if (!name || !dateOfBirth || !placeOfBirth || !dateofDeath || !placeOfDeath || !shortDescription || !longDescription) {
                reject()
                return
              }
              const res = await backend.put("/admin/composer/update/" + composerId, {
                name,
                epoch,
                birth_date: dateOfBirth,
                birth_place: placeOfBirth,
                death_date: dateofDeath,
                death_place: placeOfDeath,
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
              success: { title: 'Composer Updated!', description: 'Looks great' },
              error: { title: 'Unable to create composer', description: 'Please fill all the fields' },
              loading: { title: 'Uploading', description: 'Please wait' },
            })
          }}>Update</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdateComposerModal
