import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import TrackingPage from './pages/TrackingPage.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import OrderEditor from './pages/OrderEditor.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/suivi/:trackingCode" element={<TrackingPage />} />
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/commandes" element={<Orders />} />
        <Route path="/admin/commandes/nouvelle" element={<OrderEditor />} />
        <Route path="/admin/commandes/:id" element={<OrderEditor />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

