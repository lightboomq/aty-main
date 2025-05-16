import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputFieldReg from './InputFieldReg.jsx';
import s from '../StyleComponets/registration.module.css';

function Registration() {
    React.useEffect(() => {
        localStorage.clear();
    }, []);

    const [err, setErr] = React.useState('');
    const [department, setDepartment] = React.useState({ value: '', isNotValid: false, err: 'Выберите колонну' });

    const [fields, setFields] = React.useState([
        { value: '', text: 'Имя:', type: 'text', regexp: '^[а-яА-Я ]+$', err: 'Ввeдите Кириллицу', isNotValid: false },
        { value: '', text: 'Фамилия:', type: 'text', regexp: '^[а-яА-Я ]+$', err: 'Ввeдите Кириллицу', isNotValid: false },
        {
            value: '',
            text: 'Почта:',
            type: 'email',
            regexp: '^[A-Za-z0-9._%+-]+@[a-z0-9-]+\\.[a-z]{2,4}$',
            err: 'Проверьте правильность введённого адреса электронной почты',
            isNotValid: false,
            isEmpty: true,
        },
        {
            value: '',
            text: 'Пароль:',
            type: 'password',
            regexp: '^[^а-яА-Я ]{5,15}$',
            err: 'Любые символы, кроме Кириллицы. Длина пароля от 5 до 15 символов',
            isNotValid: false,
        },
    ]);

    const navigate = useNavigate();

    async function sendUserData(e) {

        e.preventDefault();
        if (department.value === '') {
            setDepartment(prev => ({ ...prev, isNotValid: 'true' }));
        }

        setFields(prev =>
            prev.map(field => ({
                ...field,
                isNotValid: field.value === '' || field.isNotValid,
            })),
        );

        for (let i = 0; i < fields.length; i++) {
            if (fields[i].isNotValid || fields[i].value === '' || department.isNotValid || department.value === '') return;
        }

        try {
            const res = await fetch('http://localhost:3333/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: fields[0].value[0].toUpperCase() + fields[0].value.slice(1).toLowerCase(),
                    secondName: fields[1].value[0].toUpperCase() + fields[1].value.slice(1).toLowerCase(),
                    email: fields[2].value,
                    password: fields[3].value,
                    department: department.value,
                }),
            });

            if (res.ok) {
                return navigate('/auth');
            }
            const err = await res.json();
            throw err;
        } catch (err) {
            setErr(err.message);
        }
    }
    return (
        <form onSubmit={sendUserData} className={s.wrapper}>
            <h3 className={s.regText}>Регистрация</h3>

            <div className={s.wrapperDiv}>
                <label className={`${s.wrapperInput} ${department.isNotValid ? s.highlightingInput : ''}`}>
                    Колонна:
                    <select
                        onChange={e => {
                            setDepartment(prev => ({ ...prev, value: e.target.value, isNotValid: e.target.value === '' }));
                        }}
                        className={s.department}
                    >
                        <option value=''>Не выбрано</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </select>
                </label>
                <span className={s.highlightingTextErr}>{department.isNotValid && department.err}</span>
            </div>

            {fields.map((field, i) => {
                return (
                    <InputFieldReg
                        key={field.text}
                        value={field.value}
                        i={i}
                        text={field.text}
                        type={field.type}
                        regexp={field.regexp}
                        err={field.err}
                        isNotValid={field.isNotValid}
                        setFields={setFields}
                    />
                );
            })}
            <div className={s.wrapperDiv}>
                <span className={s.highlightingTextErr}>{err}</span>
            </div>

            <button type='submit' className={s.btnReg}>
                Зарегистрироваться
            </button>

            <div className={s.wrapperLink}>
                <Link to='/auth' className={s.linkAuth}>
                    Войти в аккаунт
                </Link>
            </div>
        </form>
    );
}

export default Registration;
