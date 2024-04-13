import { Flex, Avatar, Text } from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
} from '@choc-ui/chakra-autocomplete'
import { useEffect, useRef, useState } from 'react'
import backend from '../../axios.config'
import { useSession } from 'next-auth/react'
import Separator from '../Separator'
import { useRouter } from 'next/router'
import { Fa0 } from 'react-icons/fa6'

const AutocompleteSearchBox = () => {
  const session: any = useSession()
  const router = useRouter()
  const [composersDataSearch, setComposersDataSearch] = useState<any[]>([])
  const [opusesDataSearch, setOpusesDataSearch] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const getResults = async () => {
      const res = await backend.get('/search?query=' + searchValue, {
        headers: {
          Authorization: session.data.token,
        },
      })
      if (res.data) {
        setComposersDataSearch(res.data.composers.hits)
        setOpusesDataSearch(res.data.opuses.hits)
      }
    }

    getResults()
  }, [searchValue])

  return (
    <AutoComplete rollNavigation>
      <AutoCompleteInput
        onChange={(event) => setSearchValue(event.target.value)}
        variant="filled"
        placeholder="Search..."
        autoFocus
      />
      <AutoCompleteList>
        <AutoCompleteGroup key={'composers'} showDivider title="Composers">
          {composersDataSearch.map((composer: any, oid) => (
            <AutoCompleteItem
              key={`composers-${oid}`}
              value={composer.name}
              textTransform="capitalize"
              align="center"
              onClick={() => {
                router.push('/composer/' + composer.id)
              }}
            >
              <Avatar size="sm" name={composer.name} src={composer.portrait} />
              <Text ml="4">{composer.name}</Text>
            </AutoCompleteItem>
          ))}
        </AutoCompleteGroup>
        <AutoCompleteGroup key={'opuses'} showDivider title="Opuses">
          {opusesDataSearch.map((opus: any, oid) => (
            <AutoCompleteItem
              key={`opuses-${oid}`}
              textTransform="capitalize"
              align="center"
              value={opus.title}
              onClick={() => {
                router.push('/opus/' + opus.id)
              }}
            >
              {opus.title}
            </AutoCompleteItem>
          ))}
        </AutoCompleteGroup>
      </AutoCompleteList>
    </AutoComplete>
  )
}

export default AutocompleteSearchBox
