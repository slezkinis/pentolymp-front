import { Routes, Route } from 'react-router-dom'
import { Layout, ProtectedRoute } from '../components'
import Login from '../pages/Login'
import Register from '../pages/Register'
import SubjectsList from '../pages/SubjectsList'
import TopicsList from '../pages/TopicsList'
import TasksList from '../pages/TasksList'
import TaskDetail from '../pages/TaskDetail'
import Profile from '../pages/Profile'
import PvpPage from '../pages/PvpPage'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <SubjectsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects/:subjectId/topics"
        element={
          <ProtectedRoute>
            <Layout>
              <TopicsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <TasksList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pvp"
        element={
          <ProtectedRoute>
            <Layout>
              <PvpPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRouter