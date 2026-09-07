import { useState } from 'react'
import './App.css'
import { Button, Card, TextField } from '@mui/material'

const defaultTodos = [
  'Learn Kubernetes basics',
  'Deploy application to cluster',
  'Configure persistent volumes'
]

export const App = () => {
  const [todos, setTodos] = useState(defaultTodos)
  const [inputValue, setInputValue] = useState('')

  const onSubmit = () => {
    setTodos([...todos, inputValue])
    setInputValue('')
  }

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
