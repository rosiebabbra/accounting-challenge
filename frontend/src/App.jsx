import { useState } from 'react'
import './App.css'
import FinancialReports from './components/FinancialReports.tsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <FinancialReports />
  )
}

export default App
