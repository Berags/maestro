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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Heading,
  Stack,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FaBell } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { RiFlashlightFill, RiNeteaseCloudMusicLine } from 'react-icons/ri'
import {
  BsCalendarCheck,
  BsFolder2,
  BsGearFill,
  BsMusicNote,
} from 'react-icons/bs'
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
  const { isOpen, onClose, onOpen } = useDisclosure()
  const session = useSession()

  const NavItem = (props: any) => {
    const color = useColorModeValue('gray.600', 'gray.300')

    const { icon, children } = props
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
            <NavItem icon={BsFilePerson}>Composers</NavItem>
            <NavItem icon={BsMusicNote}>Performers</NavItem>
            <NavItem icon={IoAlbumsOutline}>Albums</NavItem>
            <NavItem icon={GiMusicalScore}>Opus</NavItem>
            <NavItem icon={BiAlbum}>Recordings</NavItem>
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
                src={session.data ? (session.data!.user!.image as string) : ''}
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
            d={{ base: 'flex', md: 'none' }}
            borderBottomWidth="1px"
            borderColor={useColorModeValue('inherit', 'gray.700')}
            bg={useColorModeValue('white', 'gray.800')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            boxShadow="lg"
            h="14"
          >
            <IconButton
              aria-label="Menu"
              display={{ base: 'inline-flex', md: 'none' }}
              onClick={onOpen}
              icon={<FiMenu />}
              size="md"
            />

            <Flex align="center">
              <Icon as={RiNeteaseCloudMusicLine} h={8} w={8} />
            </Flex>
          </Flex>

          <Box
            as="main"
            minH="30rem"
            bg={useColorModeValue('auto', 'gray.800')}
            pb={50}
          >
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
                streamUrl={
                  "http://conquest.imslp.info/files/imglnks/usimg/2/21/IMSLP805710-PMLP3848-Luis_Kolodin_plays_Chopin's_Nocturne_No._20_in_C_m_Op._posth..mp3"
                }
                trackTitle={'test'}
                preloadType="auto"
              />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
