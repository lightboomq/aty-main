import React from 'react';
import Loader from './Loader.jsx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ModalWindow from './ModalWindow.jsx';
import Errors from '../store/Errors.js';
import logout from '../assets/logout.png';
import s from '../StyleComponets/tickets.module.css';

function Tickets() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');

    const wrapperTickets = React.useRef(null);
    const [ticketsId, setTicketsId] = React.useState([]);
    const [isLoaderTicket, setIsLoaderTicket] = React.useState(false);
    const [isOpenModal, setIsOpenModal] = React.useState(false);

    React.useEffect(() => {
        const getCountTickets = async () => {
            const token = JSON.parse(localStorage.getItem('user'));
            try {
                const res = await fetch('http://localhost:3333/api/tickets', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token.token}`,
                    },
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw err;
                }
                const arrTicketsId = await res.json();
                if (arrTicketsId.length < 5) {
                    wrapperTickets.current.style.gridTemplateColumns = 'repeat(3,1fr)';
                } else {
                    wrapperTickets.current.style.gridTemplateColumns = 'repeat(5,1fr)';
                }
                setTicketsId(arrTicketsId);
            } catch (err) {
                Errors.setMessage(err.message);
            }
        };
        
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
            <img src={logout} onClick={() => setIsOpenModal(true)} className={s.logout} alt='logout' />
            {isOpenModal && <ModalWindow path='/auth' setIsOpenModal={setIsOpenModal} text='Выйти из учетной записи?' />}

            <div ref={wrapperTickets} onClick={getTicket} className={s.wrapperTickets}>
                {user.isAppointExam ? (
                    <button type-test='Экзамен' className={s.btnExam} type='button'>
                        {isLoaderTicket && <Loader color='orange' />}Сдать экзамен
                    </button>
                ) : (
                    <button type-test='Тренировочный экзамен' className={s.btnExam} type='button'>
                        {isLoaderTicket && <Loader color='orange' />} Тренировочный экзамен
                    </button>
                )}

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
