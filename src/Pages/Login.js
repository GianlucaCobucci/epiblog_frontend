import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { Toast } from '../utilities/notifications';
import { Toaster } from 'react-hot-toast';


const Login = () => {
  const [formData, setFormData] = useState({email: '', password: ''});

  const successToast = new Toast("Login effettuato con successo!");
  const errorToast = new Toast("Login fallito");

  const navigate = useNavigate()

    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("loggedIn"))
      //console.log(user)
      if (user && user?.email && user?.email.length > 0){
        successToast.success('Login avvenuto con successo'); // Utilizza il metodo success di Toast per visualizzare il toast di successo
        setTimeout(() => {
          navigate("/homepage", { replace: true })
        }, 1500)
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[navigate])


  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('Errore durante il login');
      }
  
      const data = await response.json();
  
      if (response.ok){
        const { token } = data; // Estrai il token dai dati di risposta
        const user = jwtDecode(token); // Decodifica il token per ottenere i dati dell'utente
        //console.log(user); // Stampa i dati dell'utente in console
        localStorage.setItem('loggedIn', JSON.stringify({ token, user })) // Salva il token e l'utente nel localStorage
        successToast.success('Login avvenuto con successo'); // Utilizza il metodo success di Toast per visualizzare il toast di successo
        setTimeout(() => {
          navigate("/homepage", { replace: true })
        }, 1500)
      }
      
    } catch (error) {
      setError('Password o email non valida');
      errorToast.error('Login fallito'); // Utilizza il metodo error di Toast per visualizzare il toast di errore
    }
  };

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <Container fluid className="d-flex justify-content-center align-items-center vh-100">
        <Card>
          <Card.Body>
            <h4 className="card-title text-center mb-4">Login</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="text-center mb-3">
                <img
                  src="https://www.freeiconspng.com/thumbs/login-icon/user-login-icon-29.png"
                  alt="Login Icon"
                  className="img-fluid w-50"
                  style={{ maxWidth: '200px' }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci la tua email..."
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Inserisci la tua password..."
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {error && <div className="text-danger mb-3">{error}</div>}
              <div className="text-center">
                <Button variant="primary" type="submit" className='m-2'>
                  Log In
                </Button>
                <Button variant="danger" type="submit">
                  Sign Up
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;
