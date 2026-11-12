import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Landing Page */}

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/register"
          element={<Register />}
        />
        {/* User Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App
