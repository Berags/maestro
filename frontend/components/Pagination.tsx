import { Flex, FlexProps, useColorModeValue } from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from '../utils/useWindowSize'

const Pagination = ({ index, nOfPages, setPage }: any) => {
  const size = useWindowSize()
  const [pages, setPages] = useState<number[]>([])

  useEffect(() => {
    if (nOfPages < 5)
      setPages([...Array(nOfPages)].map((x, i) => i))
    else if (nOfPages >= 5 && index < 4)
      setPages([0, 1, 2, 3, nOfPages - 1])
    else if (nOfPages >= 5 && index + 2 < nOfPages)
      setPages([0, index - 1, index, index + 1, nOfPages - 1])
    else
      setPages([0, nOfPages - 3, nOfPages - 2, nOfPages - 1])
  }, [nOfPages, index])

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
        {size.width > 400 ? "Back" : "<"}
      </PaginationButton>
      {pages.map((x, i) => (
        <PaginationButton
          onClick={() => {
            setPage(x)
          }}
          isActive={index == x}
          key={i}
        >
          {x + 1}
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
