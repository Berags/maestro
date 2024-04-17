import { create } from 'zustand'

interface Piece {
  id: number
  title: string
  file_url: string
  image_url: string
}

interface PlayerStore {
  current?: Piece
  queue: Piece[]
  shuffle: boolean
  setCurrent: (piece: Piece) => void
  removeCurrent: () => void
  setQueue: (queue: Piece[]) => void
  setShuffle: (shuffle: boolean) => void
  reset: () => void
}

const usePlayer = create<PlayerStore>((set) => ({
  queue: [],
  current: undefined,
  shuffle: false,
  setCurrent: (piece: Piece) => set({ current: piece }),
  removeCurrent: () => set({ current: undefined }),
  setQueue: (queue: Piece[]) => set({ queue: queue }),
  setShuffle: (shuffle: boolean) => set({ shuffle: shuffle }),
  reset: () => set({ current: undefined, queue: [] }),
}))

export default usePlayer
