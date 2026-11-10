import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ActivityProvider from './context/ActivityProvider'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import AppLayout from './components/layout/AppLayout'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import DashboardPage from './pages/DashboardPage'
import ExplorePage from './pages/ExplorePage'

import {
  ActivityPage,
  CoachPage,
  ChallengesPage,
  ExercisesPage,
  LeaderboardPage,
  ProfilePage,
  RewardsPage,
  WalletPage,
  WorkoutsPage,
} from './pages/FeaturePages'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActivityProvider>
          <Routes>
            {/* Public authentication pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected application pages */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="workouts" element={<WorkoutsPage />} />
                <Route path="exercises" element={<ExercisesPage />} />
                <Route path="coach" element={<CoachPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="challenges" element={<ChallengesPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="rewards" element={<RewardsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </ActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}