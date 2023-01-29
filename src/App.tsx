import { Route, Routes } from 'react-router-dom'

import About from '@/pages/About'
import Home from '@/pages/Home'

import './App.css'

function App() {
  return (
    <header className='App-header'>
      <Routes>
        {/* <Route path='user' element={<Users />}>
          <Route path=':id' element={<UserDetail />} />
          <Route path='create' element={<NewUser />} />
        </Route> */}
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </header>
  )
}

export default App
