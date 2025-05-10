import React from 'react';
import Loader from './Loader.jsx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ModalWindow from './ModalWindow.jsx';
import s from '../StyleComponets/tickets.module.css';

function Tickets() {
    
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [ticketsId, setTicketsId] = React.useState([]);
    const [isLoaderTicket, setIsLoaderTicket] = React.useState(false);
    const [isOpenModal, setIsOpenModal] = React.useState(false);
   

    React.useEffect(() => {
        async function getCountTickets() {
            const token = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('http://localhost:3333/api/tickets', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });
            const arrTicketsId = await response.json();
            setTicketsId(arrTicketsId);
        }
        getCountTickets();

    }, []);

    async function getTicket(e) {
        if (e.target.tagName !== 'LI' && e.target.tagName !== 'BUTTON') return;
        
        const token = JSON.parse(localStorage.getItem('user'));
        const typeTest = e.target.getAttribute('type-test');
       
        const ticketId = e.target.getAttribute('ticketid');
        const url =
            typeTest === 'Экзамен' || typeTest === 'Тренировочный экзамен'
                ? 'http://localhost:3333/api/exam'
                : `http://localhost:3333/api/tickets/${ticketId}`;

        setIsLoaderTicket(true);
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
        });
        const ticketJson = await res.json();
        setIsLoaderTicket(false);
        for (let i = 0; i < ticketJson.length; i++) {
            ticketJson[i].questionNumber = i + 1;
        }

        localStorage.setItem('typeTest', typeTest);
        localStorage.setItem('ticketId', ticketId);
        localStorage.setItem('ticketJson', JSON.stringify(ticketJson));
        navigate('/test');
    }

    return (
        <div className={s.wrapper}>
            {isOpenModal && <ModalWindow path='/auth' setIsOpenModal={setIsOpenModal} text='Выйти из учетной записи?' />}
            
            <div onClick={getTicket} className={s.wrapperTickets}> 
            
                {user.isAppointExam ? (
                    <button type-test='Экзамен' className={s.btnExam} type='button'>
                        {isLoaderTicket && <Loader color='orange' />}Сдать экзамен
                    </button>
                ) : (
                    <button type-test='Тренировочный экзамен' className={s.btnExam} type='button'>
                        {isLoaderTicket && <Loader color='orange' />} Тренировочный экзамен
                    </button>
                )}
                <h3 className={s.title}>Билеты АТУ</h3>
                {ticketsId.map((id, i) => {
                    return (
                        <li key={id} type-test={`Билет № ${i + 1}`} ticketid={id} className={s.ticket}>
                            Билет {i + 1}
                        </li>
                    );
                })}
            </div>
        </div>
    );
}

export default observer(Tickets);
