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
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
           </div>
           <div className="App">
           <h1>Apex Edutaintment</h1>

            <Router>
              <div>
                <Routes>
                    <Route path="/register" element={<Register />} />
                </Routes>
              </div> 
            </Router>   
      </div>
    </>
  )
}

export default App
