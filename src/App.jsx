import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './Registration/Registration.jsx';
import Authorization from './Authorization/Authorization.jsx';
import SelectTicket from './SelectTicket/SelectTicket.jsx';
import Testing from './Testing/Testing.jsx';
import UserTestResult from './UserTestResult/UserTestResult.jsx';
import s from './app.module.css';

function App() {
    return (
        <div className={s.divWrapper}>
            <Routes>
                <Route path='/' element={<Registration />} />
                <Route path='/auth' element={<Authorization />} />
                <Route path='/tickets' element={<SelectTicket />} />  
                <Route path='/test' element={<Testing />} />
                <Route path='/result' element={<UserTestResult/>} />
            </Routes>
        </div>
    );
}

export default App;
