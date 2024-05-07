import { Button, Flex, Input, InputGroup, InputLeftAddon, Text } from "@chakra-ui/react";
import { useState } from "react";

const UploadAudio = ({ setFile }: any) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <Flex>
      <InputGroup>
        <InputLeftAddon w={"15vw"}><Text noOfLines={1}>Audio File</Text></InputLeftAddon>
        <Input type='file' onChange={handleFileChange} />
      </InputGroup>
    </Flex>
  )
}

export default UploadAudio
