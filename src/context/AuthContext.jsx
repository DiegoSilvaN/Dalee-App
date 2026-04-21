import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setRole(currentUser.isAnonymous ? 'client' : 'business');
      } else {
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  const loginAsClient = () => signInAnonymously(auth);

  return (
    <AuthContext.Provider value={{ user, role, loading, loginAsClient }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);