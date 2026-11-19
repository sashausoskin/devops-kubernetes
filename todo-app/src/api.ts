import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import type { Todo } from "./types"

const todoQueryKey = ['todos']
const healthCheckQueryKey = ['health']
const todosBackendUrl = import.meta.env.DEV ? import.meta.env.VITE_TODOS_BACKEND_URL : ''

export const useHealthCheck = () => (useQuery({queryKey: healthCheckQueryKey, queryFn: checkHealth, refetchInterval: 5000, retry: false}))

export const useTodosFetch = () => (useQuery({queryKey: todoQueryKey, queryFn: fetchTodos}))

export const useTodosPush = () => {
    const queryClient = useQueryClient()

    return useMutation({mutationFn: pushTodos, onSuccess: (res) => {
    queryClient.setQueryData<Todo[]>(todoQueryKey, (oldTodos) => [...(oldTodos ?? []), res.data])
}})}

export const useTodosMarkAsDone = () => {
    const queryClient = useQueryClient()

    return useMutation({mutationFn: markTodoAsDone, onSuccess: (_res, id) => {
        queryClient.setQueryData<Todo[]>(todoQueryKey, (oldTodos) => 
            oldTodos?.map((todo) => todo.id === id ? {...todo, done: true} : todo)
        )
    }})
}

export const useBreakApp = () => {
    const queryClient = useQueryClient()

    return useMutation({mutationFn: breakApp, onSuccess: () => {
        queryClient.setQueryData(healthCheckQueryKey, () => false)
    }})
}

const checkHealth = async () => {
    try {
        await axios.get(`${todosBackendUrl}/healthz`)
        return true
    }
    catch {
        return false
    }
}

const fetchTodos = async () => {
    const response = await axios.get<Todo[]>(`${todosBackendUrl}/todos`)
    return response.data
}

const pushTodos = async (todo: string) => {
    return axios.post(`${todosBackendUrl}/todos`, {todo})
}

const markTodoAsDone = async (id: number) => {
    return axios.put(`${todosBackendUrl}/todos/${id}`)
}

const breakApp = async () => {
    return axios.post(`${todosBackendUrl}/healthz/break`)
}