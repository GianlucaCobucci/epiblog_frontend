import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const useAuth = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('loggedIn'));
        if (session && session.user && session.user.email) {
            setIsAuthorized(true);
        }
        setIsLoaded(true);
    }, []);

    return { isLoaded, isAuthorized };
}

const ProtectedRoutes = () => {
    const navigate = useNavigate();
    const { isLoaded, isAuthorized } = useAuth();

    useEffect(() => {
        if (isLoaded && !isAuthorized) {
            navigate('/');
        }
    }, [navigate, isLoaded, isAuthorized]);

    return <Outlet />;
}


export default ProtectedRoutes