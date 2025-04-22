import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './Componets/Registration.jsx';
import Authorization from './Componets/Authorization.jsx';
import Tickets from './Componets/Tickets.jsx';
import Test from './Componets/Test.jsx';
import Comments from './Componets/Comments.jsx';
import UserTestResult from './Componets/UserTestResult.jsx';
import Layout from './Layout.jsx';

function App() {
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path='/' element={<Registration />} />
                <Route path='/auth' element={<Authorization />} />
                <Route path='/tickets' element={<Tickets />} />
                <Route path='/test' element={<Test />} />
                <Route path='/comments' element={<Comments />} />
                <Route path='/result' element={<UserTestResult />} />
            </Route>
        </Routes>
    );
}

export default App;
