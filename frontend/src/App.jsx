import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FinancialReports from './components/FinancialReports.tsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <FinancialReports />
    </div>
  )
}

export default App
