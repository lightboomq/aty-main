import React from 'react';
import Loader from './Loader.jsx';
import s from '../StyleComponets/select.module.css';
import { useNavigate } from 'react-router-dom';

function SelectTicket() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [ticketsId, setTicketsId] = React.useState([]);
    const [isLoader, setIsLoader] = React.useState(false);
    
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

        setIsLoader(true);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
        });
        const ticketJson = await response.json();
        setIsLoader(false);
        for (let i = 0; i < ticketJson.length; i++) {
            ticketJson[i].questionNumber = i + 1;
        }

        localStorage.setItem('typeTest', typeTest);
        localStorage.setItem('ticketId', ticketId);
        localStorage.setItem('ticketJson', JSON.stringify(ticketJson));
        navigate('/test');
    }

    return (
        <div onClick={getTicket} className={s.wrapper}>
            <h3 className={s.headerText}>Билеты АТУ</h3>

            {user.isAppointExam ? (
                <button type-test='Экзамен' className={s.btnExam} type='button'>
                    {isLoader && <Loader color='orange' />}Сдать экзамен
                </button>
            ) : (
                <button type-test='Тренировочный экзамен' className={s.btnExam} type='button'>
                    {isLoader && <Loader color='orange' />} Тренировочный экзамен
                </button>
            )}

            {ticketsId.map((id, i) => {
                return (
                    <li key={id} type-test={i + 1} ticketid={id} className={s.ticket}>
                        {`Билет ${i + 1}`}{' '}
                    </li>
                );
            })}
        </div>
    );
}

export default SelectTicket;
