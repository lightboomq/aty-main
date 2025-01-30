import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './Componets/Registration.jsx';
import Authorization from './Componets/Authorization.jsx';
import SelectTicket from './Componets/SelectTicket.jsx';
import Testing from './Componets/Testing.jsx';
import UserTestResult from './Componets/UserTestResult.jsx';
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
