import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { AuthContext } from "./AuthContext";
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    async function login() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }
    async function logout() {
        await signOut(auth);
    }
    const value = {
        user,
        loading,
        login,
        logout,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
