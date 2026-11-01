import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { loading, user, token } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#E3FDFD] flex flex-col items-center justify-center gap-4">
                {/* Tailwind Spinner: an outline circle with only top-border colored, spinning infinitely */}
                <div className="w-12 h-12 rounded-full border-4 border-[#A6E3E9] border-t-[#71C9CE] animate-spin" />
                <p className="text-sm font-semibold text-slate-600 animate-pulse">
                    Verifying session...
                </p>
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to='/' replace />;
    }

    return children;
};

export default ProtectedRoute;
