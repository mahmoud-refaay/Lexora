import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/NotFound/NotFound';
import UsersHub from './features/users/pages/UsersHub';
import UsersList from './features/users/pages/UsersList';
import UserRoles from './features/users/pages/UserRoles';
import UserDetails from './features/users/pages/UserDetails';
import ClientsHub from './features/clients/pages/ClientsHub';
import ClientsList from './features/clients/pages/ClientsList';
import ClientDetails from './features/clients/pages/ClientDetails';
import CasesHub from './features/cases/pages/CasesHub';
import CasesList from './features/cases/pages/CasesList';
import CaseDetails from './features/cases/pages/CaseDetails';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />

            {/* إدارة المستخدمين */}
            <Route path="users" element={<UsersHub />} />
            <Route path="users/list" element={<UsersList />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="users/roles" element={<UserRoles />} />

            {/* إدارة العملاء */}
            <Route path="clients" element={<ClientsHub />} />
            <Route path="clients/list" element={<ClientsList />} />
            <Route path="clients/:id" element={<ClientDetails />} />

            {/* إدارة القضايا */}
            <Route path="cases" element={<CasesHub />} />
            <Route path="cases/list" element={<CasesList />} />
            <Route path="cases/:id" element={<CaseDetails />} />

            {/* الإعدادات */}
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
