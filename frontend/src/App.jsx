import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './index.css'; // Import your Tailwind CSS file here
import './App.css'

import SearchFilterComponent from './components/SearchComponent_new'; // Update the import path if necessary


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>


{/* <h1>Student Placement and Internship Data</h1> */}
<SearchFilterComponent />
  </div>
  )
}

export default App
