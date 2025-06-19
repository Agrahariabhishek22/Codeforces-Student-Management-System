import {BrowserRouter as Router,Routes,Route}from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import StudentProfile from './components/StudentProfile'




export default function App() {
  return(
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/profile/:id' element={<StudentProfile/>} ></Route>
        </Routes>
      </Layout>
    </Router>
  ) 
}
