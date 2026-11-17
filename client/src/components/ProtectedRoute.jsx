import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { loading, user, token } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#F8F6F4] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#DDD0C8] border-t-[#323232] animate-spin" />
                <p className="text-xs font-medium text-[#555555]">
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
