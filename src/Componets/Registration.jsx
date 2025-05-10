import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputFieldReg from './InputFieldReg.jsx';
import Errors from '../store/Errors';
import {observer} from 'mobx-react-lite';
import s from '../StyleComponets/registration.module.css';

function Registration() {
    React.useEffect(() => {
        localStorage.clear();
    }, []);

    
    const [select, setSelect] = React.useState({ value: '', isNotValid: false, err: 'Выберите колонну' });

    const [formData, setFormData] = React.useState([
        { value: '', text: 'Имя:', type: 'text', regexp: '^[а-яА-Я ]+$', err: 'Ввeдите Кириллицу', isNotValid: false },
        { value: '', text: 'Фамилия:', type: 'text', regexp: '^[а-яА-Я ]+$', err: 'Ввeдите Кириллицу', isNotValid: false },
        {
            value: '',
            text: 'Почта:',
            type: 'email',
            regexp: '^[A-Za-z0-9._%+-]+@[a-z0-9-]+\\.[a-z]{2,4}$',
            err: 'Проверьте правильность введённого адреса электронной почты',
            isNotValid: false,
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
    async function sendForm() {
        if (select.value === ''){
            setSelect(prev=>({...prev,isNotValid:'true'}))
        }
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].isNotValid || formData[i].value === '' || select.isNotValid || select.value === '') return;
        }
        try {
            const res = await fetch('http://localhost:3333/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData[0].value[0].toUpperCase() + formData[0].value.slice(1).toLowerCase(),
                    secondName: formData[1].value[0].toUpperCase() + formData[1].value.slice(1).toLowerCase(),
                    email: formData[2].value,
                    password: formData[3].value,
                    department: select.value,
                }),
            });
            
            if (res.ok) {
                return navigate('/auth');
            }
            const err = await res.json();
           
            throw new Error(err.message);
        } catch (err) {
            Errors.setMessage(err.message);
        }
    }
    return (
        <form className={s.wrapper}>
            <h3 className={s.regText}>Регистрация</h3>

            <div className={s.wrapperDiv}>
                <label className={`${s.wrapperInput} ${select.isNotValid ? s.highlightingInput:''}`}>
                    Колонна:
                    <select
                        onChange={e => {
                            setSelect(prev => ({ ...prev, value: e.target.value, isNotValid: e.target.value === '' }));
                        }}
                        className={s.select}
                    >
                        <option value=''>Не выбрано</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </select>
                </label>
                <span className={s.highlightingTextErr}>{select.isNotValid && select.err}</span>
            </div>

            {formData.map((obj, i) => {
                return (
                    <InputFieldReg
                        key={obj.text}
                        value={obj.value}
                        i={i}
                        text={obj.text}
                        type={obj.type}
                        regexp={obj.regexp}
                        err={obj.err}
                        isNotValid={obj.isNotValid}
                        setFormData={setFormData}
                    />
                );
            })}
            <div className={s.wrapperDiv}>
                <span className={s.highlightingTextErr}>{Errors.getMessage()}</span>
            </div>
            
            <button onClick={sendForm} className={s.btnReg} type='button'>
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

export default observer(Registration);
