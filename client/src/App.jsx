import { Navigate, Route, Routes } from 'react-router-dom'
import WelcomePage from './features/welcome/WelcomePage.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import RegisterPage from './features/auth/RegisterPage.jsx'
import DashboardPage from './features/dashboard/DashboardPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import GuestRoute from './routes/GuestRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />

      {/* Only for signed-out visitors */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Only for signed-in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}