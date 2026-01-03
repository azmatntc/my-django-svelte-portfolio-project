// src/App.jsx
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotComponent from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectDetails from './pages/ProjectDetails';
import Customers from './pages/Customers';
import Communications from './pages/Communications';
import InquiryForm from './pages/InquiryForm';
import Logout from './pages/Logout';
import UserRoleView from './pages/UserRoleView';
import CSRFView from './pages/CSRFView';
import ProjectDashboard from './components/ProjectDashboard';

function App() {
  const [layout, setLayout] = useState('default');
  const location = useLocation();

  // CRM routes that should show <Sidebar>
  const crmRoutes = ['/customers', '/communications', /^\/projects\/[^/]+\/dashboard$/];

  const isCrmRoute = crmRoutes.some((route) =>
    typeof route === 'string'
      ? location.pathname.startsWith(route)
      : route.test(location.pathname)
  );

  useEffect(() => {
    if (Cookies.get('ai_features') === 'disabled') return;
    axios
      .get('/api/adapt-layout/')
      .then((res) => setLayout(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <UserProvider>
      <div className="flex bg-gray-900 min-h-screen text-white">
        {isCrmRoute && <Sidebar />}
        <div
          className={`flex flex-col flex-1 min-h-screen ${isCrmRoute ? 'ml-64 md:ml-0' : ''
            }`}
        >
          <Navbar />
          <main className="p-8 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/user/role/" element={<UserRoleView />} />
              <Route path="/csrf/" element={<CSRFView />} />

              {/* Project routes */}
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/projects/:id/dashboard" element={<ProjectDashboard />} />

              {/* CRM routes */}
              <Route path="/customers" element={<Customers />} />
              <Route path="/communications" element={<Communications />} />
              <Route path="/inquiry" element={<InquiryForm />} />
            </Routes>
          </main>

          {Cookies.get('ai_features') !== 'disabled' && (
            <ErrorBoundary>
              <ChatbotComponent />
            </ErrorBoundary>
          )}

          <Footer className="mt-auto" />
        </div>
      </div>
    </UserProvider>
  );
}

function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;