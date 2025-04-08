import React from 'react';
import UserIcon from './UserIcon.jsx';
import logoutIcon from '../assets/logout.png';
import Loader from './Loader.jsx';
import logoHappySmile from '../assets/happySmile.svg';
import logoSadSmile from '../assets/sadSmile.svg';
import logoFavorite from '../assets/favorite.svg';
import Errors from '../store/Errors.js';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import ModalWindow from './ModalWindow.jsx';
import s from '../StyleComponets/selectTicket.module.css';

function SelectTicket() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [ticketsId, setTicketsId] = React.useState([]);
    const [isLoaderTicket, setIsLoaderTicket] = React.useState(false);
    const [isOpenModal, setIsOpenModal] = React.useState(false);
    const [myMistakes, setMyMistakes] = React.useState([]);
    const [isLoaderMistakes, setIsLoaderMistakes] = React.useState(false);

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

        async function getMyMistakes() {
            try {
                setIsLoaderMistakes(true);

                const token = JSON.parse(localStorage.getItem('user'));
                const res = await fetch('http://localhost:3333/api/tickets/failedQuestions', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token.token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setMyMistakes(data);
                    setIsLoaderMistakes(false);
                    return;
                }
                throw new Error(res.message);
            } catch (err) {
                Errors.setMessage(err.message);
            }
        }
        getMyMistakes();
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
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
        });
        const ticketJson = await response.json();
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
            {isOpenModal && <ModalWindow path='/auth' setIsOpenModal={setIsOpenModal} text='Выйти из учетной записи' />}

            <div onClick={getTicket} className={s.wrapperTickets}>
                <div className={s.wrapperHeader}>
                    <h3>Билеты АТУ</h3>
                    <div className={s.testt}>
                        <UserIcon />
                        <img onClick={() => setIsOpenModal(true)} className={s.iconHeader} src={logoutIcon} alt='logout' />
                    </div>
                </div>

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
                        <li key={id} type-test={i + 1} ticketid={id} className={s.ticket}>
                            Билет {i + 1}
                        </li>
                    );
                })}
            </div>

            {/* <div className={s.wrapperMyMistakes}>
                {isLoaderMistakes ? (
                    <h5>Загрузка...</h5>
                ) : (
                    <>
                        <div style={{ display: 'flex', margin: '0px ' }}>
                            {myMistakes.length > 0 ? (
                                <>
                                    <img src={logoSadSmile} alt='logoSadSmile' />
                                    <Link className={s.linkMistake}>Мои ошибки ({myMistakes.length})</Link>
                                </>
                            ) : (
                                <>
                                    <img src={logoHappySmile} alt='logoHappySmile' />
                                    <p style={{ marginLeft: '5px' }}>У вас нет ошибок</p>
                                </>
                            )}
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', marginTop: '20px' }}>
                    <img src={logoFavorite} alt='favorite' />
                    <Link className={s.linkMistake}>Избранные вопросы</Link>
                </div>
            </div> */}
        </div>
    );
}

export default observer(SelectTicket);
