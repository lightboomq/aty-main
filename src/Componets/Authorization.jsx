import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from '../StyleComponets/authorization.module.css';

function Authorization() {
    React.useEffect(() => {
        localStorage.clear();
    }, []);

    const [mail, setMail] = React.useState('solovei@gmail.com');
    const [password, setPassword] = React.useState('228solovei');
    const [err, setErr] = React.useState('');
    const navigate = useNavigate();

    async function login() {
        try {
            const res = await fetch('http://localhost:3333/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: mail,
                    password: password,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw err;
            }
            const userData = await res.json();
            userData.email = mail;
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/tickets');
        } catch (err) {
            setErr(err.message);
        }
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
            <div className={s.error}>{err}</div>
        </form>
    );
}

export default Authorization;
