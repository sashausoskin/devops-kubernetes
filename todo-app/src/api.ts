import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const todoQueryKey = ['todos']
const todosBackendUrl = import.meta.env.DEV ? import.meta.env.VITE_TODOS_BACKEND_URL : '/'

export const useTodosFetch = () => (useQuery({queryKey: todoQueryKey, queryFn: fetchTodos}))

export const useTodosPush = () => {
    const queryClient = useQueryClient()

    return useMutation({mutationFn: pushTodos, onSuccess: (res) => {
    queryClient.setQueryData<string[]>(todoQueryKey, (oldTodos) => [...(oldTodos ?? []), res.data])
}})}

const fetchTodos = async () => {
    const response = await axios.get<string[]>(`${todosBackendUrl}/todos`)
    return response.data
}

const pushTodos = async (todo: string) => {
    return axios.post(`${todosBackendUrl}/todos`, {todo})
}