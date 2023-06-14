import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login';
import Homepage from './Pages/Homepage';
import ProtectedRoutes from './Middleware/ProtectedRoutes.js';
import UsersList from './Pages/UsersList';
import PostsList from './Pages/PostsList';
import Success from './Pages/Success';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route exact path='/' element={<Login/>} />
        <Route path="/success" element={<Success/>}/> 


        <Route element={<ProtectedRoutes />}>
          <Route path={'/homepage'} element={<Homepage/>} />
          <Route path={'/posts'} element={<PostsList/>} />
          <Route path='/users' element={<UsersList/>}/>
          <Route path='/login' element={<Login/>}/>
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
