import { useState } from 'react'
import './App.css'
import { Button, Card, TextField } from '@mui/material'
import { useBreakApp, useHealthCheck, useTodosFetch, useTodosMarkAsDone, useTodosPush } from './api'

export const App = () => {
  const [inputValue, setInputValue] = useState('')

  const {data: isHealthy, isLoading: isCheckingHealth} = useHealthCheck()
  const {data: todos, isLoading} = useTodosFetch()
  const {mutate: mutateTodos } = useTodosPush()
  const {mutate: mutateMarkTodoCompleted} = useTodosMarkAsDone()
  const {mutate: breakApp} = useBreakApp()

  const onSubmit = () => {
    mutateTodos(inputValue)
    setInputValue('')
  }

  if (isLoading || isCheckingHealth || todos === undefined) return <a>Loading...</a>

  if (!isHealthy) return <>
    <h1>System failure</h1>
    <a>The Todo App is currently unhealthy. Please wait for recovery</a>
  </>

  return <>
    <div className='mainContainer'>
      <h1>Todo App</h1>
      <img src={import.meta.env.DEV ? 'http://localhost:3002/image' : '/image'} width='800px'/>
      <br />
      <div className='inputContainer'>
        <TextField slotProps={{ htmlInput: { maxLength: 120 }}} id='todo-input' variant='outlined' value={inputValue} onChange={(e) => setInputValue(e.currentTarget.value)}/>
        <Button variant='contained' onClick={onSubmit}>Submit</Button>
      </div>
      <div className='todosContainer'>
        {todos.map((todo) => 
          <Card className='todoCard' key={todo.id}>
            {todo.todo}
            {todo.done
              ? 'Done'
              : <Button onClick={() => mutateMarkTodoCompleted(todo.id)}>Mark done</Button>
            }
          </Card>
        )}
      </div>
      <Button onClick={() => breakApp()} variant='contained' color='error'>Break app</Button>
    </div>
  </>
}

export default App
