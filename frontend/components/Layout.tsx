'use client'
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
  Avatar,
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Collapse,
  Skeleton,
} from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { IoMdSettings } from 'react-icons/io'
import { RiNeteaseCloudMusicLine } from 'react-icons/ri'
import { FiMenu } from 'react-icons/fi'
import { MdHome, MdKeyboardArrowRight } from 'react-icons/md'
import { signOut, useSession } from 'next-auth/react'
import { BsFilePerson } from 'react-icons/bs'
import { BiAlbum } from 'react-icons/bi'
import { IoAlbumsOutline } from 'react-icons/io5'
import { GiMusicalScore } from 'react-icons/gi'
import NextLink from 'next/link'
import 'react-h5-audio-player/lib/styles.css'
import React from 'react'
import MusicPlayer from './MusicPlayer'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import backend from '../axios.config'
import AutocompleteSearchBox from './search/AutocompleteSearchBox'
import CreatePlaylistModal from './CreatePlaylistModal'

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const router = useRouter()
  const { data }: any = useSession()
  const playlist = useDisclosure()
  const createPlaylist = useDisclosure()

  useEffect(() => {
    // Configuring axios default headers
    // Add a response interceptor
    backend.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        signOut()
        return Promise.reject(error)
      }
    )
  }, [props.children])

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

  const SidebarContent = (props: any) => (
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
            <Icon as={RiNeteaseCloudMusicLine} h={8} w={8} />
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
              Playlist
              <Icon as={MdKeyboardArrowRight} ml="auto" />
            </NavItem>
            <Collapse in={playlist.isOpen}>
              <NavItem pl="12" py="2" onClick={createPlaylist.onToggle}>
                Create
              </NavItem>
              <NextLink href={'/playlist'}>
                <NavItem pl="12" py="2">
                  My Playlist
                </NavItem>
              </NextLink>
            </Collapse>
            <NavItem icon={GiMusicalScore}>Opus</NavItem>
            <NextLink href={'/recording'}>
              <NavItem icon={BiAlbum}>Recordings</NavItem>
            </NextLink>
            <NavItem icon={IoMdSettings}>Settings</NavItem>
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
