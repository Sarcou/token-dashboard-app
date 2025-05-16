
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, LoginCredentials, RegisterCredentials, UserData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setLoading(true);
        try {
          const userData = await authService.getMe(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Erreur lors du chargement de l\'utilisateur:', err);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadUser();
    }
  }, [token]);

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(credentials);
      
      // Store the token
      localStorage.setItem('authToken', response.token);
      setToken(response.token);
      
      // Fetch user data
      const userData = await authService.getMe(response.token);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès!",
      });
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: errorMessage,
      });
      
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      // Store the token
      localStorage.setItem('authToken', response.token);
      setToken(response.token);
      
      // Fetch user data
      const userData = await authService.getMe(response.token);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue!",
      });
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      });
      
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion",
      description: "Vous êtes déconnecté",
    });
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
