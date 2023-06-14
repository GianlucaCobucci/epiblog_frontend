import { useEffect } from "react";
import jwt from 'jwt-decode'
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../Pages/Login";

const useDecodedSession = () => {
    const session = JSON.parse(localStorage.getItem("loggedIn"))
    const decodedSession = session ? jwt(session.token) : null
    const location = useLocation()
    const navigate = useNavigate()

    useEffect (()=>{
        if(!session){
            navigate(<Login/>)
        }
        if(session && location.pathname !== "/login"){
            navigate("/homepage")
        }
    },[navigate, session])
    return decodedSession
}

/* const useDecodedSession = () => {
    const session = JSON.parse(localStorage.getItem("loggedIn"))
    const [decodedSession, setDecodedSession] = useState(null)

    useEffect(() => {
        if (session) {
            const decodedSession = jwt(session.token)
            setDecodedSession(decodedSession)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return decodedSession
}
 */

export default useDecodedSession