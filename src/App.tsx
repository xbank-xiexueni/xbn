import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  const [count, setCount] = useState(0)

  return (
    <header className='App-header'>
      <Routes>
        {/* <Route path='user' element={<Users />}>
          <Route path=':id' element={<UserDetail />} />
          <Route path='create' element={<NewUser />} />
        </Route> */}
        <Route path='/' element={<Home />}></Route>
        <Route path='/about' element={<About />}></Route>
      </Routes>
    </header>
  );
}

export default App
