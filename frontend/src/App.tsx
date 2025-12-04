import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import PlatformForm from './pages/PlatformForm';
import UserForm from './pages/UserForm';
import PlatformsList from './pages/PlatformsList';
import UsersList from './pages/UsersList';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/platforms" element={<PrivateRoute><PlatformsList /></PrivateRoute>} />
        <Route path="/platforms/new" element={<PrivateRoute><PlatformForm /></PrivateRoute>} />
        <Route path="/platforms/edit/:id" element={<PrivateRoute><PlatformForm /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UsersList /></PrivateRoute>} />
        <Route path="/users/new" element={<PrivateRoute><UserForm /></PrivateRoute>} />
        <Route path="/users/edit/:id" element={<PrivateRoute><UserForm /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
