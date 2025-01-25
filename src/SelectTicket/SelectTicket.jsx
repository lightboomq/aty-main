import React from 'react';
import s from './select.module.css';
import { useNavigate } from 'react-router-dom';

function SelectTicket() {
    const navigate = useNavigate();
    const [ticketsId, setTicketsId] = React.useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    
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
        
        const token = JSON.parse(localStorage.getItem('user'));
        const ticketNumber = e.target.getAttribute('number');
        const ticketId = e.target.getAttribute('ticketid');
        const url = ticketNumber === 'Экзамен' ? 'http://localhost:3333/api/exam' : `http://localhost:3333/api/tickets/${ticketId}`;

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

        localStorage.setItem('ticketNumber', ticketNumber);
        localStorage.setItem('ticketId', ticketId);
        localStorage.setItem('ticketJson', JSON.stringify(ticketJson));
        navigate('/test');
    }

    return (
        <>
            <h3 className={s.headerText}>Билеты АТУ</h3>


            <div onClick={getTicket} className={s.wrapper}>
                {ticketsId.map((id, i) => {
                    return <li key={id} number={i + 1} ticketid={id} className={s.ticket}>{`Билет ${i + 1}`}</li>;
                })}
            </div>

            {user.isAppointExam && (
                <button onClick={getTicket} number='Экзамен' className={s.btnExam} type='button'>
                    Сдать экзамен
                </button>
            )}
        </>
        
    );
}

export default SelectTicket;
