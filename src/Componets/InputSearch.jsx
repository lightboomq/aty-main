import React from 'react';
import imgСrossInput from '../assets/crossInput.svg';
import imgSearchLoop from '../assets/searchLoop.svg';
import ModeStorage from '../store/ModeStorage.js';
import ModalWindow from './ModalWindow.jsx';

import s from '../StyleComponets/inputSearch.module.css';

function Input({ inputValue, setInputValue, ticketsFound }) {
    function test() {
        ModeStorage.setFlagTheme();
        setIsOpenModal(true)
    }
    console.log(true)
    const [isOpenModal,setIsOpenModal] = React.useState(false);
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

                <button  onClick={test} type='button' className={`${s.goBackBtn} ${s[ModeStorage.theme]}`} >
                    Завершить просмотр
                </button>
                {isOpenModal && <ModalWindow path='/tickets' setIsOpenModal={setIsOpenModal} text='Завершить просмотр и вернуться к билетам?'/>}
            </div>
            {inputValue ? <span className={s.spanInputFoundText}>Найдено: {ticketsFound.length}</span> : ''}
        </>
    );
}

export default Input;
