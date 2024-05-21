import React from 'react';
import imgСrossInput from '../../assets/crossInput.svg';
import imgSearchLoop from '../../assets/searchLoop.svg';
import ModeStorage from '../../store/ModeStorage.js';
// import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import s from './input.module.css';

function Input({ inputValue, setInputValue, ticketsFound }) {
    function test() {
        ModeStorage.setFlagTheme();
    }
    return (
        <>
            <div className={s.divWrapper}>
                <div className={`${s.divWrapperInput} ${s[ModeStorage.theme]}`}>
                    <input
                        className={`${s.inputSearch} ${s[ModeStorage.theme]}`}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        type='text'
                        placeholder='Поиск вопроса...'
                    />
                    {inputValue ? null : <img src={imgSearchLoop} alt='searchLoop' />}
                    {inputValue ? (
                        <img onClick={() => setInputValue('')} className={s.imgCrossSearchInput} src={imgСrossInput} alt='cross' />
                    ) : null}

                    
                </div>
                
                <Link onClick={test} className={`${s.link} ${s[ModeStorage.theme]}`} to='/'>
                    Завершить просмотр
                </Link>
                
            </div>
            {inputValue ? <span className={s.spanInputFoundText}>Найдено: {ticketsFound.length}</span> : ''}
        </>
    );
}

export default Input;
