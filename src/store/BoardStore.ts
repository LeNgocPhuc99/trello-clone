import { create } from 'zustand'
import { getTodosGroupedByColum } from '@/libs/getTodosGroupedByColum'
import { databases } from '../../appwrite'

interface BoardState {
    board: Board
    getBoard: () => void
    setBoardState: (board: Board) => void
    updateTodoInDB: (todo: Todo, columnId: TypeColum) => void
}

// create store
export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypeColum, Column>()
    },

    getBoard: async () => {
        // fetch data form database
        const board = await getTodosGroupedByColum()
        set({ board })
    },

    setBoardState: (board) => set({ board }),

    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
    },
}))