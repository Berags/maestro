import { Flex, Avatar, Text } from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem,
} from '@choc-ui/chakra-autocomplete'
import { useEffect, useRef, useState } from 'react'
import backend from '../../axios.config'
import { useSession } from 'next-auth/react'

const AutocompleteSearchBox = () => {
  const session: any = useSession()
  const [dataSearch, setDataSearch] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    console.log(searchValue)
    const getResults = async () => {
      const res = await backend.get('/search?query=' + searchValue, {
        headers: {
          Authorization: session.data.token,
        },
      })
      if (res.data) setDataSearch(res.data.hits)
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
        {dataSearch.map((composer: any, oid) => (
          <AutoCompleteItem
            key={`option-${oid}`}
            value={composer.name}
            textTransform="capitalize"
            align="center"
          >
            <Avatar size="sm" name={composer.name} src={composer.portrait} />
            <Text ml="4">{composer.name}</Text>
          </AutoCompleteItem>
        ))}
      </AutoCompleteList>
    </AutoComplete>
  )
}

export default AutocompleteSearchBox
