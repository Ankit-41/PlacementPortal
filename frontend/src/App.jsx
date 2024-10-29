import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext';
import './index.css'; // Import your Tailwind CSS file here
import './App.css'

// import SearchFilterComponent from './components/SearchComponent_new'; // Update the import path if necessary
import PaginatedSearchFilter from './components/SearchComponent_new';

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

        <PaginatedSearchFilter />
      </div>
    </ThemeProvider>
  )
}

export default App
