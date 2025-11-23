import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Auth/Login.jsx'
import AddVendorForm from './components/Vendor/AddVendorForm.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
     <div>
      <Login></Login>
      <AddVendorForm></AddVendorForm>
    </div>
  )
}

export default App
