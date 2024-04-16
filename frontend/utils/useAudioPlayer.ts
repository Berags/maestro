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
  setCurrent: (piece: Piece) => void
  removeCurrent: () => void
  setQueue: (queue: Piece[]) => void
  reset: () => void
}

const usePlayer = create<PlayerStore>((set) => ({
  queue: [],
  current: undefined,
  setCurrent: (piece: Piece) => set({ current: piece }),
  removeCurrent: () => set({ current: undefined }),
  setQueue: (queue: Piece[]) => set({ queue: queue }),
  reset: () => set({ current: undefined, queue: [] }),
}))

export default usePlayer
