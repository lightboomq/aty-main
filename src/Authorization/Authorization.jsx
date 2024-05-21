import React from 'react';
import s from './authorization.module.css';
import { Link , useNavigate} from 'react-router-dom';

function Authorization() {
    const [mail, setMail] = React.useState('mantrov@gmail.com');
    const [password, setPassword] = React.useState('1234567');
    const [errMessage, setErrMessage] = React.useState('');
    const navigate = useNavigate()
    
    async function login() {
        const user = {
            email: mail,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:3333/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) {
                throw new Error(response.message);
            }
            const userData = await response.json();

            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/tickets');
        } catch (err) {
            setErrMessage(err);
        }
    }

    if (errMessage) {
        return <form className={s.wrapper}>{errMessage}</form>;
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
                <input value={password} onChange={e => setPassword(e.target.value)} className={s.input} type='password' autoComplete='off' />
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
