import React from 'react';
import s from './select.module.css';
import { useNavigate } from 'react-router-dom';

function SelectTicket() {
    const navigate = useNavigate();
    const [ticketLength, setTicketLength] = React.useState([]);

    React.useEffect(() => {
        async function getCountTickets() {
            const token = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('http://localhost:3333/tickets/count', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });
            const arrLength = await response.json();

            const arr = [];
            for (let i = 0; i < arrLength.ticketsCount; i++) {
                arr.push(i);
            }

            setTicketLength([...arr]);
        }
        getCountTickets();
    }, []);

    async function getTicket(e) {
        const token = JSON.parse(localStorage.getItem('user'));

        const index = e.target.getAttribute('index');
        localStorage.setItem('selectedTicket', index);

        const selectedTicket = localStorage.getItem('selectedTicket');

        const url = selectedTicket === 'Экзамен' ? 'http://localhost:3333/exam' : `http://localhost:3333/tickets/${selectedTicket}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
        });

        const ticketJson = await response.json();
        for (let i = 0; i < ticketJson.length; i++) {
            ticketJson[i].questionNumber = i + 1;
        }
        localStorage.setItem('ticketJson', JSON.stringify(ticketJson));

        navigate('/test');
    }

    return (
        <div onClick={getTicket} className={s.wrapper}>
            <h3 className={s.headerText}>Билеты АТУ</h3>

            {ticketLength.map((item, i) => (
                <li key={`${'Билет'} + ${i}`} index={i + 1} className={s.ticket}>{`Билет ${item + 1}`}</li>
            ))}

            <button index='Экзамен' className={s.btnЭкзамен} type='button'>
                Сдать экзамен
            </button>
        </div>
    );
}

export default SelectTicket;
