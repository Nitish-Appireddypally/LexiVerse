import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex  items-center justify-center bg-gray-900 text-2xl font-bold">
    Tailwind CSS is working! 🎉
  </div>
  )
}

export default App
