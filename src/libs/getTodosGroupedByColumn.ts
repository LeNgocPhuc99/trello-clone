import { databases } from "../appwrite"
// import { Board, Column, TypeColum } from "../typings";


export const getTodosGroupedByColumn = async () => {
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!)

    // get from database
    const todos = data.documents;

    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }

        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            ...(todo.image && { image: JSON.parse(todo.image) })
        })

        return acc
    }, new Map<TypeColum, Column>)

    // if columns  don't have inprogress, todo and done ==> add them with empty columns
    const columnTypes: TypeColum[] = ['todo', 'inprogress', 'done']
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: []
            })
        }
    }

    // sort columns (Map) by columnType
    const sortedColumn = new Map(Array.from(columns.entries()).sort((a, b) => {
        return columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    }))

    const board: Board = {
        columns: sortedColumn
    }

    return board
}