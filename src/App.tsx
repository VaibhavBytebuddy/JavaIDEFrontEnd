// src/App.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/api/test')
      .then(response => setMessage(response.data))
      .catch(error => setMessage('Error connecting to backend'))
  }, [])

  return (
    <div>
      <h1>Java Online Editor</h1>
      <p>Backend status: {message}</p>
    </div>
  )
}

export default App