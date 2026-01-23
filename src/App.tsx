import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import SubjectsList from './pages/SubjectsList'
import TopicsList from './pages/TopicsList'
import TasksList from './pages/TasksList'
import TaskDetail from './pages/TaskDetail'
import Layout from './components/Layout'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div>Загрузка...</div>
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
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
    </Routes>
  )
}

export default App