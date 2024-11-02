import React from 'react';
import s from './authorization.module.css';
import { Link, useNavigate } from 'react-router-dom';

function Authorization() {
    localStorage.clear();
    const [mail, setMail] = React.useState('sidorov@gmail.com');
    const [password, setPassword] = React.useState('200922');
   
    const navigate = useNavigate();

    
    async function login() {
        const url = 'http://147.45.159.11/api/auth/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: mail,
                password: password,
            }),
        });

        const userData = await response.json();
        userData.email = mail
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/tickets');
    }

    return (
        <form className={s.wrapper}>
            <h3 className={s.regText}>Вход</h3>

            <label className={s.wrapperInput}>
                Почта:
                <input value={mail} onChange={e => setMail(e.target.value)} className={s.input} type='text' />
            </label>

            <label className={s.wrapperInput}>
                Пароль для входа:
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={s.input}
                    type='password'
                    autoComplete='off'
                />
            </label>

            <button onClick={login} className={s.btnEnter} type='button'>
                Войти
            </button>

            <div className={s.wrapperLink}>
                <Link to={'/'} className={s.linkReg}>
                    Нету аккаунта? Зарегестрируйтесь
                </Link>
            </div>
        </form>
    );
}

export default Authorization;
