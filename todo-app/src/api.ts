import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const todoQueryKey = ['todos']
const healthCheckQueryKey = ['health']
const todosBackendUrl = import.meta.env.DEV ? import.meta.env.VITE_TODOS_BACKEND_URL : ''

export const useHealthCheck = () => (useQuery({queryKey: healthCheckQueryKey, queryFn: checkHealth, refetchInterval: 5000}))

export const useTodosFetch = () => (useQuery({queryKey: todoQueryKey, queryFn: fetchTodos}))

export const useTodosPush = () => {
    const queryClient = useQueryClient()

    return useMutation({mutationFn: pushTodos, onSuccess: (res) => {
    queryClient.setQueryData<string[]>(todoQueryKey, (oldTodos) => [...(oldTodos ?? []), res.data])
}})}

export const useBreakApp = () => {
    const queryClient = useQueryClient()

    return useMutation({mutationFn: breakApp, onSuccess: () => {
        queryClient.setQueryData(healthCheckQueryKey, () => false)
    }})
}

const checkHealth = async () => {
    const res = await axios.get(`${todosBackendUrl}/healthz`)
    if (res.status >= 500) {
        return false
    }
    return true
}

const fetchTodos = async () => {
    const response = await axios.get<string[]>(`${todosBackendUrl}/todos`)
    return response.data
}

const pushTodos = async (todo: string) => {
    return axios.post(`${todosBackendUrl}/todos`, {todo})
}

const breakApp = async () => {
    return axios.post(`${todosBackendUrl}/healthz/break`)
}