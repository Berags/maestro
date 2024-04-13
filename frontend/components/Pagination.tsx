import { Flex, FlexProps, useColorModeValue } from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from '../utils/useWindowSize'

const Pagination = ({ index, nOfPages, setPage }: any) => {
  const size = useWindowSize()
  return (
    <Flex
      as="nav"
      aria-label="Pagination"
      w="full"
      justifyContent="center"
      alignItems="center"
      mt={{ base: 3, md: 0 }}
    >
      <PaginationButton
        borderTopLeftRadius="md"
        borderBottomLeftRadius="md"
        onClick={() => {
          if (index - 1 < 0) return
          setPage(index - 1)
        }}
      >
        {size.width > 400 ? "Next" : "<"}
      </PaginationButton>
      {[...Array(nOfPages)].map((x, i) => (
        <PaginationButton
          onClick={() => {
            setPage(i)
          }}
          isActive={index == i}
          key={i}
        >
          {i + 1}
        </PaginationButton>
      ))}
      <PaginationButton
        onClick={() => {
          if (index + 1 >= nOfPages) return
          setPage(index + 1)
        }}
        borderTopRightRadius="md"
        borderBottomRightRadius="md"
      >
        {size.width > 400 ? "Next" : ">"}
      </PaginationButton>
    </Flex>
  )
}

interface PaginationButtonProps extends FlexProps {
  children: ReactNode
  isActive?: boolean
  isDisabled?: boolean
}

const PaginationButton = ({
  children,
  isDisabled,
  isActive,
  ...props
}: PaginationButtonProps) => {
  const activeStyle = {
    bg: useColorModeValue('gray.300', 'gray.700'),
  }

  return (
    <Flex
      p={3}
      px={4}
      fontSize="md"
      fontWeight="500"
      lineHeight={0.8}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      border="1px solid"
      mr="-1px"
      borderColor={useColorModeValue('gray.300', 'gray.700')}
      {...(isActive && activeStyle)}
      {...props}
    >
      {children}
    </Flex>
  )
}

export default Pagination
