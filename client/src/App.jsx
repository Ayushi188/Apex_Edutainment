import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Register from './Screens/Register';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Screens/Login';
import Home from './Screens/Home';
import Dashboard from './Screens/Dashboard';
import StudentEnrollment from './Screens/StudentEnrollement';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App" >
        <Router>
          <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/student-enrollment" element={<StudentEnrollment />} />
            </Routes>
          </div> 
        </Router>   
      </div>
    </>
  )
}

export default App
