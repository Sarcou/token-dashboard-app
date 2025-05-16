
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    document.title = "Mon Application - Authentification";
  }, []);
  
  // Redirect to login page
  return <Navigate to="/login" replace />;
};

export default Index;
