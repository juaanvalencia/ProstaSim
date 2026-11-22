
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchProfile,
  getSession,
  onAuthChange,
  signIn,
  signOut,
  signUp,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await getSession();

      if (error) {
        console.error("Error al obtener sesión:", error.message);
      }

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = onAuthChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await fetchProfile(user.id);

      if (error) {
        console.error("Error al consultar perfil:", error.message);
        setProfile(null);
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [user]);

  const register = async (fullName, email, password) => {
    return await signUp(fullName, email, password);
  };

  const login = async (email, password) => {
    return await signIn(email, password);
  };

  const logout = async () => {
    return await signOut();
  };

  const value = {
    user,
    profile,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}