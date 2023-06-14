import React, {useEffect, useState} from 'react'
import jwt from 'jwt-decode'


const Success = () => {
    const [userSession, setUserSession] = useState(null)

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search)
        const userParam = urlParams.get("token")
        if(userParam){
            const user = jwt(userParam)
            setUserSession(user)
            localStorage.setItem('loggedIn', JSON.stringify({token:userParam}))
        }
    },[])

  return (
    <div>Benvenuto {userSession && userSession.username}</div>
  )
}

export default Success