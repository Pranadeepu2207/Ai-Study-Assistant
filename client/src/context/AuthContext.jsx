import { useContext, useEffect, useState, createContext } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(true)

    //Function to fetch current logged-in user profile from /api/auth/me
    const fetchCurrentUser = async () => {
        try {
            if (!token) {
                setLoading(false)
                return
            }

            const res = await axiosInstance.get('/auth/me')
            setUser(res.data.user)
        } catch (error) {
            console.error(`Failed to fetch user`, error)
            // If token is invalid or expired, clear it out
            logout()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCurrentUser()
    }, [token])

    const login = (newToken) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, fetchCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}


//Custom Hook for easy access to AuthContext
export const useAuth = () =>
    useContext(AuthContext)
