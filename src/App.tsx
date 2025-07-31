import './App.css'
import AdminDahboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TesterDashboard from './pages/TesterDashboard';
import LoginPage from './pages/LoginPage';
import AddProject from './pages/AddProject';
import ProjectDetails from './pages/ProjectDetails';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<HomePage /> } />
        <Route path='/login' element={<LoginPage /> } />
        <Route path='/admin' element={<AdminDahboard /> } />
        <Route path='/tester' element={<TesterDashboard /> } />
        <Route path='/add-project' element={<AddProject /> } />
        <Route path="/admin/project/:id" element={<ProjectDetails role="admin" />} />
        <Route path="/tester/project/:id" element={<ProjectDetails role="tester" />} />   
        <Route path="/admin/project/report/:id" element={<ReportPage role="admin" />} />   
        <Route path="/tester/project/report/:id" element={<ReportPage role="tester" />} />   
      </Routes>
    </Router>
    </>
  )
}
export default App
