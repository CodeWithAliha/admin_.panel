import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Favorites from './pages/Favorites';
import Payment from './pages/Payment';
import Layout from './components/Layout';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8D5C4] to-[#D4B5A0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C9A58A] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const getPageContent = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <Users />;
      case 'favorites':
        return <Favorites />;
      case 'payment':
        return <Payment />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Welcome to Coffee Dashboard';
      case 'products':
        return 'Products Management';
      case 'orders':
        return 'Orders Management';
      case 'analytics':
        return 'Analytics & Reports';
      case 'users':
        return 'Users Management';
      case 'favorites':
        return 'Your Favorites';
      case 'payment':
        return 'Payment Management';
      case 'settings':
        return 'Dashboard Settings';
      default:
        return 'Welcome to Coffee Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Monitor your business at a glance';
      case 'products':
        return 'Manage your coffee products';
      case 'orders':
        return 'View and manage orders';
      case 'analytics':
        return 'Track your performance';
      case 'users':
        return 'Manage team members';
      case 'favorites':
        return 'Your favorite items';
      case 'payment':
        return 'Payment and transactions';
      case 'settings':
        return 'Customize your dashboard';
      default:
        return 'Monitor your business at a glance';
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
    >
      {getPageContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
