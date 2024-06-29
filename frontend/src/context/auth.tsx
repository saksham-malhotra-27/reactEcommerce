import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

interface User {
    email: string;
    phone: string;
    role: number;
    location: string;
    id: string;
}

interface AuthState {
  user: User | null;
  token: string;
}

type AuthContextType = [AuthState, (newAuth: AuthState) => void, boolean];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('auth');
    if (data) {
      const parseData = JSON.parse(data);
    //  console.log("Parsed Auth Data: ", parseData); // Debugging line
      setAuth(parseData);
    }
    setLoading(false); // Set loading to false once data is fetched
  }, []);

  const updateAuth = (newAuth: AuthState) => {
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  };

  return (
    <AuthContext.Provider value={[auth, updateAuth, loading]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth, AuthProvider };
