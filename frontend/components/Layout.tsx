import {
  Box,
  Text,
  Flex,
  useColorModeValue,
  Icon,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  VStack,
  Link,
  chakra,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FaBell } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { BsGearFill, BsMusicNote } from 'react-icons/bs'
import { FiMenu, FiSearch } from 'react-icons/fi'
import { MdHome } from 'react-icons/md'
import { signOut, useSession } from 'next-auth/react'
import { BsFilePerson } from 'react-icons/bs'
import { BiAlbum } from 'react-icons/bi'
import { IoAlbumsOutline } from 'react-icons/io5'
import { GiMusicalScore } from 'react-icons/gi'
import NextLink from 'next/link'
import PlayerFooter from './PlayerFooter'

type Props = {
  children: ReactNode
}

export default function Component(props: Props) {
  const sidebar = useDisclosure()
  const integrations = useDisclosure()
  const color = useColorModeValue('gray.600', 'gray.300')
  const session = useSession()

  const NavItem = (props: any) => {
    const { icon, children, ...rest } = props
    return (
      <Flex
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color="inherit"
        _dark={{
          color: 'gray.400',
        }}
        _hover={{
          bg: 'gray.100',
          _dark: {
            bg: 'gray.900',
          },
          color: 'gray.900',
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: color,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    )
  }

  const SidebarContent = (props: any) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      border
      color="inherit"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Text
          fontSize="2xl"
          ml="2"
          color="brand.500"
          _dark={{
            color: 'white',
          }}
          fontWeight="semibold"
        >
          Maestro
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem icon={MdHome}><NextLink href={"/home"}>Home</NextLink></NavItem>
        <NavItem icon={BsFilePerson}>Composers</NavItem>
        <NavItem icon={BsMusicNote}>Performers</NavItem>
        <NavItem icon={IoAlbumsOutline}>Albums</NavItem>
        <NavItem icon={GiMusicalScore}>Opus</NavItem>
        <NavItem icon={BiAlbum}>Recordings</NavItem>
        <NavItem icon={IoMdSettings}>Settings</NavItem>
      </Flex>
    </Box>
  )

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: 'gray.700',
      }}
      minH="100vh"
    >
      <SidebarContent
        display={{
          base: 'none',
          md: 'unset',
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          _dark={{
            bg: 'gray.800',
          }}
          borderBottomWidth="1px"
          color="inherit"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{
              base: 'inline-flex',
              md: 'none',
            }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <InputGroup
            w="96"
            display={{
              base: 'none',
              md: 'flex',
            }}
          >
            <InputLeftElement color="gray.500">
              <FiSearch />
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>

          <Flex align="center">
            <Icon color="gray.500" as={FaBell} cursor="pointer" />
            <Popover>
              <PopoverTrigger>
                <Avatar
                  ml="4"
                  size="sm"
                  name="anubra266"
                  src={session.data ? session.data!.user!.image as string : ""}
                  cursor="pointer"
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  <VStack>
                    <Link as={NextLink} href={"/profile/"}>
                      Profile
                    </Link>
                    <Button
                      colorScheme="teal"
                      variant="link"
                      onClick={() => signOut()}
                    >
                      Logout
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>

        <Box as="main" p="4">
          {/* Add content here, remove div below  */}
          {/*<Box borderWidth="4px" borderStyle="dashed" rounded="md" h="96" />*/}
          {props.children}
        </Box>

        <Flex
          w="full"
          bg="#edf3f8"
          _dark={{ bg: '#3e3e3e' }}
          alignItems="center"
          justifyContent="center"
          position={'fixed'}
          bottom={0}
        >
          <Flex
            w="full"
            as="footer"
            flexDir={{ base: 'column', sm: 'row' }}
            align="center"
            justify="left"
            px="6"
            py="4"
            bg="white"
            _dark={{
              bg: 'gray.800',
            }}
          >
            <PlayerFooter
              streamUrl={"http://conquest.imslp.info/files/imglnks/usimg/2/21/IMSLP805710-PMLP3848-Luis_Kolodin_plays_Chopin's_Nocturne_No._20_in_C_m_Op._posth..mp3"}
              trackTitle={'test'}
              preloadType="auto"
            />
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
