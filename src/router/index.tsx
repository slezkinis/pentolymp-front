import { Routes, Route } from 'react-router-dom'
import Layout from '../Components/Layout/Layout'
import Protected_route from "../Components/Protected_route/Protected_route"
import Login_page from '../pages/login_page'
import Register_page from '../pages/register'
import PvP_page from '../pages/pvp'
import Subjects_page from '../pages/subjects'
import Topics_page from '../pages/topics'
import Task_page from '../pages/task'
import Tasks_page from '../pages/tasks_page'
import Profile_page from '../pages/profile'


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login_page />} />
      <Route path="/register" element={<Register_page />} />
      <Route
        path="/"
        element={
          <Protected_route>
            <Layout>
              <Subjects_page />
            </Layout>
          </Protected_route>
        }
      />
      <Route
        path="/subjects/:subjectId/topics"
        element={
          <Protected_route>
            <Layout>
              <Topics_page />
            </Layout>
          </Protected_route>
        }
      />
      <Route
        path="/tasks"
        element={
          <Protected_route>
            <Layout>
              <Tasks_page />
            </Layout>
          </Protected_route>
        }
      />
      <Route
        path="/task/:id"
        element={
          <Protected_route>
            <Layout>
              <Task_page />
            </Layout>
          </Protected_route>
        }
      />
      <Route
        path="/profile"
        element={
          <Protected_route>
            <Layout>
              <Profile_page />
            </Layout>
          </Protected_route>
        }
      />
      <Route
        path="/pvp"
        element={
          <Protected_route>
            <Layout>
              <PvP_page />
            </Layout>
          </Protected_route>
        }
      />
    </Routes>
  )
}

export default AppRouter