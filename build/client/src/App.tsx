import React from 'react';
import { Container } from 'react-bootstrap';
import {Routes, Route} from "react-router-dom"
import { useSelector } from "react-redux";
import Home from './home/pages/Home';
import MainHeader from './shared/components/Navigation/MainHeader';
import Login from './user/pages/Login/Login';
import Signup from './user/pages/Signup/Signup';
import Profile from './user/pages/Profile/Profile';
import ErrorPage from './default/pages/ErrorPage';
import Users from './user/pages/Users/Users';
import Questions from './questions/pages/Questions';
import AskQuestion from './questions/pages/AskQuestion';
import QuestionView from './questions/pages/QuestionView';

function App() {

  let routes;

  const {user} = useSelector((state:any) => state.auth);

  if(user){
    routes = <Routes>
    <Route path='/' element={<Home />}/>
    <Route path='/questions' element={<Questions />}/>
    <Route path='/users' element={<Users />}/>
    <Route path='/profile' element={<Profile />}/>
    <Route path='/askquestion' element={<AskQuestion />}/>
    {/* Routes login and signup are avaliable for after redirect */}
    <Route path='/login' element={<Login />} />
    <Route path='/signup' element={<Signup />}/>

    <Route path='/question/:qid' element={<QuestionView />} />
    <Route path='/user/:uid' element={<Profile />}/>
    
    <Route path='*' element={<ErrorPage />} />
  </Routes>
  } else {
    routes = <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/questions' element={<Home />}/>
      <Route path='/users' element={<Users />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  }

  return (
    <div className="App">
      <MainHeader />

      <Container className='mt-5'>
        {routes}
      </Container>

    </div>
  );
}

export default App;
