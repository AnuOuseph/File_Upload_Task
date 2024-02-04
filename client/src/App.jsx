import Dashboard from './pages/dashboard'
import Login from './pages/login'
import Register from './pages/register'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import axios from 'axios';
import ProtectedRoute from './protected/ProtectedRoute'

// Creating an Axios instance with a base URL
export const Instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

function App() {

  

  return (

    <> 
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
