import './App.css'

export const App = () => {
  return <>
    <div className='mainContainer'>
      <h1>Todo App</h1>
      <img src={import.meta.env.DEV ? 'http://localhost:3002/image' : '/image'} width='800px'/>
      <br />
      DevOps with Kubernetes 2026
    </div>
  </>
}

export default App
