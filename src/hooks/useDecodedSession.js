import { useEffect, useState } from "react";
import jwt from 'jwt-decode'

const useDecodedSession = () => {
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

export default useDecodedSession