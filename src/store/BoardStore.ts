import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/libs/getTodosGroupedByColumn'
import { uploadImage } from '@/libs/uploadImage'
import { ID, databases } from '../appwrite'


interface BoardState {
    board: Board
    getBoard: () => void
    setBoardState: (board: Board) => void
    updateTodoInDB: (todo: Todo, columnId: TypeColum) => void
    newTaskInput: string
    setNewTaskInput: (input: string) => void
    newTaskType: TypeColum
    setNewTaskType: (columnId: TypeColum) => void
    image: File | null;
    setImage: (image: File | null) => void

    searchString: string
    setSearchString: (searchString: string) => void

    addTask: (todo: string, columnId: TypeColum, image?: File | null) => void
    deleteTask: (taskIndex: number, todoId: Todo, id: TypeColum) => void
}

// create store
export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypeColum, Column>()
    },
    newTaskInput: '',
    setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
    newTaskType: 'todo',
    setNewTaskType: (columnId: TypeColum) => set({ newTaskType: columnId }),
    image: null,
    setImage: (image: File | null) => set({ image }),
    searchString: '',
    setSearchString: (searchString) => set({ searchString }),

    getBoard: async () => {
        // fetch data form database
        const board = await getTodosGroupedByColumn()
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

    deleteTask: async (taskIndex: number, todo: Todo, id: TypeColum) => {

    },

    addTask: async (todo: string, columnId: TypeColum, image?: File | null) => {
        let file: Image | undefined

        // upload image
        if (image) {
            const fileUploaded = await uploadImage(image)
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                }
            }
        }

        // create document

        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                // include image if it exist
                ...(file && { image: JSON.stringify(file) })
            }
        )

        // update state
        set({ newTaskInput: '' })

        set((state) => {
            const newColumns = new Map(state.board.columns)

            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && { image: file })
            }

            const column = newColumns.get(columnId)

            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo]
                })
            } else {
                newColumns.get(columnId)?.todos.push(newTodo)
            }

            return {
                board: {
                    columns: newColumns
                }
            }
        })
    },
}))