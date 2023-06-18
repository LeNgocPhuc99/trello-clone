import { Models } from "appwrite"

export { }

declare global {
    interface Board {
        columns: Map<TypeColum, Column>
    }

    type TypeColum = 'todo' | 'inprogress' | 'done'

    interface Column {
        id: TypeColum
        todos: Todo[]
    }

    interface Todo {
        $id: string,
        $createdAt: string
        title: string
        status: TypeColum
        image?: Image
    }

    interface Image {
        bucketId: string
        fileId: string
    }
}
