import { create } from 'zustand'
import { getTodosGroupedByColum } from '@/libs/getTodosGroupedByColum'

interface BoardState {
    board: Board
    getBoard: () => void
}

// create store
export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypeColum, Column>()
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColum()

        set({ board })
    }
}))