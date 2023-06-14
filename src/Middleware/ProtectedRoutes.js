import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import jwt from 'jwt-decode'
import Login from '../Pages/Login'

const useAuth = () => {
    return JSON.parse(localStorage.getItem('loggedIn'))
}

const useSession = () => {
    const session = useAuth()
    const decodedSession = session ? jwt(session.token) : null
    const navigate = useNavigate()

    useEffect (()=>{
        if(!session){
            navigate("/login", {replace: true})
        }
    },[navigate, session])
    return decodedSession
}

const ProtectedRoutes = () => {
    const isAuth = useAuth()
    const session = useSession()
    console.log(session)
    return isAuth ? <Outlet/> : <Login/>
}

/* const useAuth = () => {
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
} */


export default ProtectedRoutes