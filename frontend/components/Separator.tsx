import { AbsoluteCenter, Box, Divider } from '@chakra-ui/react'
import { NextComponentType } from 'next'

type Props = {
  text: string
}

const Separator = (props: Props) => {
  return (
    <Box position="relative" padding="10">
      <Divider />
      <AbsoluteCenter bg={'#F7FAFC'} px="4">
        {props.text}
      </AbsoluteCenter>
    </Box>
  )
}

export default Separator
