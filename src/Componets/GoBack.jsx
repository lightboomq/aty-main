import React from 'react';
import logo from '../assets/GoBack.png';
import ModalWindow from './ModalWindow.jsx';


function GoBack() {
    const [isOpenModal, setIsOpenModal] = React.useState(false);
    
    return (
        <>
            <img onClick={()=>setIsOpenModal(true)} width={40} height={40} style={{ cursor: 'pointer' }} src={logo} alt='Вернуться назад' />
            {isOpenModal && <ModalWindow path='/tickets' setIsOpenModal={setIsOpenModal} text='Завершить тестирование и вернуться к билетам?' />}
        </>
    );
}

export default GoBack;
