import { useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Sparkles } from "lucide-react";

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        // Read the token passed by backend in the URL query string
        const token = searchParams.get('token');

        if (token) {
            login(token);
            navigate('/dashboard', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="min-h-screen w-full bg-[#E3FDFD] flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md border border-[#A6E3E9] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-lg shadow-[#71C9CE]/10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#CBF1F5] flex items-center justify-center text-[#71C9CE] mb-6 shadow-xs">
                    <Sparkles className="w-7 h-7" />
                </div>

                <div className="w-10 h-10 rounded-full border-3 border-[#A6E3E9] border-t-[#71C9CE] animate-spin mb-4" />

                <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Authenticating
                </h2>
                <p className="text-sm text-slate-500">
                    Signing you in with Google... Please wait.
                </p>
            </div>
        </div>
    );
};

export default OAuthSuccess;
