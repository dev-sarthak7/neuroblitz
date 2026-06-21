import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ScoreProvider } from './context/ScoreContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FlashType from './games/FlashType/FlashType'
import SequenceGrid from './games/SequenceGrid/SequenceGrid'
import NBack from './games/NBack/NBack'
import MathSprint from './games/MathSprint/MathSprint'
import StroopTest from './games/StroopTest/StroopTest'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScoreProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/game/flash-type" element={<FlashType />} />
            <Route path="/game/sequence-grid" element={<SequenceGrid />} />
            <Route path="/game/nback" element={<NBack />} />
            <Route path="/game/math-sprint" element={<MathSprint />} />
            <Route path="/game/stroop-test" element={<StroopTest />} />
          </Routes>
        </ScoreProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}