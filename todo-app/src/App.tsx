import { useState } from 'react'
import './App.css'
import { Button, Card, TextField } from '@mui/material'
import { useTodosFetch, useTodosPush } from './api'

export const App = () => {
  const [inputValue, setInputValue] = useState('')

  const {data: todos, isLoading} = useTodosFetch()
  const {mutate: mutateTodos } = useTodosPush()

  const onSubmit = () => {
    mutateTodos(inputValue)
    setInputValue('')
  }

  if (isLoading || todos === undefined) return <a>Loading...</a>

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
        <Card className='todoCard'>{todo}</Card>
      )}
      </div>
    </div>
  </>
}

export default App
