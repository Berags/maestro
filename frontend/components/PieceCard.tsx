import {
  Skeleton,
  Stack,
  StackProps,
  Tag
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import backend from '../axios.config'
import DefaultPieceCard from './PieceCard/DefaultPieceCard'
import PlaylistPieceCardVariant from './PieceCard/PlaylistPieceCardVariant'
import SmallPieceCardVariant from './PieceCard/SmallPieceCardVariant'

type PieceData = {
  id: number
  title: string
  composer: string
  duration: string
  image_url: string
  file_url: string
  liked: boolean
}

type Props = {
  pieceData: PieceData
  request?: boolean
  setUpdated: Function
  variant: string
  key?: number
  defaultPlaylist?: any
}

const PieceCard: any = (props: Props) => {
  const pieceData = props.pieceData
  const { data }: any = useSession()
  const [playlists, setPlaylists] = useState([])
  const [isLiked, setLiked] = useState<boolean>(pieceData.liked)
  if (!pieceData) return <Skeleton />

  useEffect(() => {
    const fetchPlaylist = async () => {
      const res = await backend.get('/playlist/my-playlists', {
        headers: {
          Authorization: data.token,
        },
      })

      setPlaylists(res.data)
    }

    fetchPlaylist()
  }, [])

  if (props.variant && props.variant == 'pl') {
    return <PlaylistPieceCardVariant isLiked={isLiked} setLiked={setLiked} pieceData={pieceData} setUpdated={props.setUpdated} request={props.request} defaultPlaylist={props.defaultPlaylist} />
  }

  if (props.variant && props.variant == 'sm') {
    return <SmallPieceCardVariant isLiked={isLiked} setLiked={setLiked} pieceData={pieceData} setUpdated={props.setUpdated} request={props.request} defaultPlaylist={props.defaultPlaylist} />
  }

  return (
    <DefaultPieceCard
      pieceData={pieceData}
      playlists={playlists}
      defaultPlaylist={props.defaultPlaylist}
      setUpdated={props.setUpdated}
      variant={props.variant} />
  )
}

interface TagsProps extends StackProps {
  skills: string[]
}

const Tags = ({ skills, ...props }: TagsProps) => {
  return (
    <Stack spacing={1} mt={3} alignItems="center" flexWrap="wrap" {...props}>
      {skills.map((skill) => (
        <Tag key={skill} m="2px" size="sm">
          {skill}
        </Tag>
      ))}
    </Stack>
  )
}
export default PieceCard
