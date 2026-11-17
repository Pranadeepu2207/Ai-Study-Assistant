import { useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Shield } from "lucide-react";

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            login(token);
            navigate('/dashboard', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="min-h-screen w-full bg-[#F8F6F4] flex items-center justify-center p-4">
            <div className="bg-white border border-[#DDD0C8] rounded-lg p-6 max-w-sm w-full text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-md bg-[#F4EFEB] flex items-center justify-center text-[#323232] mb-4">
                    <Shield className="w-5 h-5" />
                </div>

                <div className="w-7 h-7 rounded-full border-2 border-[#DDD0C8] border-t-[#323232] animate-spin mb-3" />

                <h2 className="text-base font-semibold text-[#323232] mb-1">
                    Authenticating Session
                </h2>
                <p className="text-xs text-[#555555]">
                    Validating credentials and completing sign in...
                </p>
            </div>
        </div>
    );
};

export default OAuthSuccess;
