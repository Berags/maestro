'use client'
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import 'react-h5-audio-player/lib/styles.css'
import { Toaster } from 'react-hot-toast'
import { BiAlbum } from 'react-icons/bi'
import { BsFilePerson } from 'react-icons/bs'
import { FaExternalLinkAlt } from "react-icons/fa"
import { FiMenu } from 'react-icons/fi'
import { IoAlbumsOutline, IoClose } from 'react-icons/io5'
import { MdHome, MdKeyboardArrowRight } from 'react-icons/md'
import { RiNeteaseCloudMusicLine } from 'react-icons/ri'
import backend from '../axios.config'
import CreatePlaylistModal from './CreatePlaylistModal'
import MusicPlayer from './MusicPlayer'
import AutocompleteSearchBox from './search/AutocompleteSearchBox'

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isAdmin, setIsAdmin] = React.useState(false)
  const router = useRouter()
  const { data }: any = useSession()
  const playlist = useDisclosure()
  const createPlaylist = useDisclosure()

  useEffect(() => {
    onClose()
  }, [router.pathname])

  const NavItem = (props: any) => {
    const color = useColorModeValue('gray.600', 'gray.300')

    const { icon, children, ...rest } = props
    return (
      <Flex
        align="center"
        px="4"
        py="3"
        cursor="pointer"
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        color={useColorModeValue('inherit', 'gray.400')}
        _hover={{
          bg: useColorModeValue('gray.100', 'gray.900'),
          color: useColorModeValue('gray.900', 'gray.200'),
        }}
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

  const SidebarContent = (props: any) => {
    useEffect(() => {
      const checkAdmin = async () => {
        const res = await backend.get(
          `/auth/identity?id=${(data.provider == 'github' ? 'gh' : 'ds') + data.accountId
          }`,
          {
            headers: {
              Authorization: data.token,
            },
          }
        )
        setIsAdmin(res.data.is_admin)
      }

      checkAdmin()
    }, [])

    return (
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex="sticky"
        h="full"
        // pb="10"
        overflowX="hidden"
        overflowY="auto"
        bg={useColorModeValue('white', 'gray.800')}
        borderColor={useColorModeValue('inherit', 'gray.700')}
        borderRightWidth="1px"
        w="60"
        {...props}
      >
        <VStack
          h="full"
          w="full"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box w="full">
            <Flex
              px="4"
              py="5"
              align="center"
              onClick={() => {
                isOpen ? onClose() : null
              }}
            >
              {isOpen ? (
                <Icon cursor={'pointer'} as={IoClose} h={8} w={8} />
              ) : (
                <Icon as={RiNeteaseCloudMusicLine} h={8} w={8} />
              )}
              <Text
                fontSize="2xl"
                ml="2"
                color={useColorModeValue('brand.500', 'white')}
                fontWeight="semibold"
              >
                Maestro
              </Text>
            </Flex>
            <Flex
              direction="column"
              as="nav"
              fontSize="md"
              color="gray.600"
              aria-label="Main Navigation"
            >
              <NextLink href={'/home'}>
                <NavItem icon={MdHome}>Home</NavItem>
              </NextLink>
              <NextLink href={'/composer'}>
                <NavItem icon={BsFilePerson}>Composers</NavItem>
              </NextLink>
              <NavItem icon={IoAlbumsOutline} onClick={playlist.onToggle}>
                Playlists
                <Icon as={MdKeyboardArrowRight} ml="auto" />
              </NavItem>
              <Collapse in={playlist.isOpen}>
                <NavItem pl="12" py="2" onClick={createPlaylist.onToggle}>
                  Create
                </NavItem>
                <NextLink href={'/playlist'}>
                  <NavItem pl="12" py="2">
                    My Playlists
                  </NavItem>
                </NextLink>
              </Collapse>
              <NextLink href={'/recording'}>
                <NavItem icon={BiAlbum}>Recordings</NavItem>
              </NextLink>
            </Flex>
          </Box>

          <Flex px="4" py="5" mt={10} justifyContent="center" alignItems="center">
            <Menu>
              <MenuButton
                as={Button}
                size={'sm'}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                _hover={{ textDecoration: 'none' }}
              >
                <Avatar
                  size={'sm'}
                  name="Ahmad"
                  src={data ? (data.user!.image as string) : ''}
                />
              </MenuButton>
              <MenuList fontSize={17} zIndex={5555}>
                {isAdmin ? <MenuItem as={NextLink} href={'/admin/dashboard'}>
                  <HStack>
                    <Text>Admin Dashboard</Text>
                    <FaExternalLinkAlt />
                  </HStack>
                </MenuItem> : null}
                <MenuItem as={NextLink} href={'/profile/my-profile'}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => signOut()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </VStack>
      </Box>
    )
  }

  return (
    <>
      <Box
        as="section"
        bg={useColorModeValue('gray.50', 'gray.700')}
        minH="100vh"
      >
        <Toaster position="top-center" reverseOrder={true} />
        <SidebarContent display={{ base: 'none', md: 'unset' }} />
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Flex
            as="header"
            align="center"
            w="full"
            px="4"
            borderBottomWidth="1px"
            borderColor={useColorModeValue('inherit', 'gray.700')}
            bg={useColorModeValue('white', 'gray.800')}
            justifyContent={{ base: 'space-between' }}
            boxShadow="lg"
            h="14"
            top={'0'}
            position={'sticky'}
            zIndex={55}
          >
            <IconButton
              aria-label="Menu"
              display={{ base: 'inline-flex', md: 'none' }}
              onClick={onOpen}
              icon={<FiMenu />}
              size="md"
            />
            <Flex align="center" w={'80%'} pr={6} pl={2}>
              <AutocompleteSearchBox />
            </Flex>

            <Flex align="center" justify={'flex-end'}>
              <Icon as={RiNeteaseCloudMusicLine} h={8} w={8} />
            </Flex>
          </Flex>

          <Box
            as="main"
            minH="50rem"
            bg={useColorModeValue('auto', 'gray.800')}
            pb={50}
          >
            <CreatePlaylistModal disclosure={createPlaylist} />
            {props.children}
          </Box>
          <Flex
            bottom={'0'}
            position={'sticky'}
            as="footer"
            align="center"
            w="full"
            borderColor={useColorModeValue('inherit', 'gray.700')}
            bg={useColorModeValue('white', 'gray.800')}
            justifyContent={{ md: 'flex-start' }}
            boxShadow="lg"
          >
            <Flex align={'center'} flexGrow={'1'}>
              <MusicPlayer />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}

export default Layout
