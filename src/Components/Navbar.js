import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logout from './Logout';

const NavigationBar = ({ currentPage }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedIn');
        if (loggedInUser) {
            const outerUserObject = JSON.parse(loggedInUser);
            setUser(outerUserObject.user);
        }
    }, []);

    return (
        <>
            <Navbar style={{ backgroundColor: '#D9D9D9', position: 'fixed', width: '100%', zIndex: 1000 }} expand="lg">
                <Navbar.Brand className="m-2">Il mio blog</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className='w-100'>
                    <Nav className="ml-auto mr-1">
                        {currentPage !== 'homepage' && <Nav.Link as={Link} to="/homepage" className="mr-3"> Go to Homepage </Nav.Link>}
                        {currentPage !== 'posts' && <Nav.Link as={Link} to="/posts" className="mr-3">   Go to Posts    </Nav.Link>}
                        {currentPage !== 'users' && <Nav.Link as={Link} to="/users" className="mr-3">  Go to Users   </Nav.Link>}
                    </Nav>
                    {user && (
                        <NavDropdown align="end" title={
                            <>
                                <Image src="https://picsum.photos/55/55" roundedCircle className="mr-2" />
                            </>
                        } id="basic-nav-dropdown" className='ms-auto px-2'>
                            {user && <NavDropdown.Item href="#action/3.3">Benvenuto {user.firstName + ' ' + user.lastName}</NavDropdown.Item>}
                            <NavDropdown.Item href="#action/3.1">Profilo</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Impostazioni</NavDropdown.Item>
                            <Logout /> 
                        </NavDropdown>
                    )}
                </Navbar.Collapse>
            </Navbar>
            <div style={{ paddingTop: '50px' }}>
            </div>
        </>
    );
};

export default NavigationBar;




