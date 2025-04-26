import React from 'react';
import Header from './Header.jsx';
import NavOfQuestion from './NavOfQuestion.jsx';
import GoBack from './GoBack.jsx';
import Timer from './Timer.jsx';
import Question from './Question.jsx';
import StepBtns from './StepBtns.jsx';
import ModeStorage from '../store/ModeStorage.js';
import UserComments from './UserComments.jsx';
import Errors from '../store/Errors.js';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import iconComments from '../assets/comments.svg';
import s from '../StyleComponets/test.module.css';

function Testing() {
    const typeTest = localStorage.getItem('typeTest');
    const [ticket, setTicket] = React.useState([{ question: '', answers: [], img: '', questionId: '' }]);
    const [indexTicket, setIndexTicket] = React.useState(0);
    const [userAnswers, setUserAnswers] = React.useState([0]);
    const [counterComments, setCounterComments] = React.useState({});
    const [isOpenComments, setIsOpenComments] = React.useState(true);

    const navigate = useNavigate();

    const states = {
        ticket,
        userAnswers,
        indexTicket,
        setTicket,
        setUserAnswers,
        setIndexTicket,
    };

    React.useEffect(() => {
        const localeStorageTicket = JSON.parse(localStorage.getItem('ticketJson'));
        const arr = [];

        for (let i = 0; i < localeStorageTicket.length; i++) {
            arr.push(null);
        }

        setTicket(localeStorageTicket); // основной массив вопросов, из выбраного билета или экзамен
        setUserAnswers(arr); //второстепенный массив для записи  0 или 1 после ответа на вопрос + опора при навигаций по вопросам
    }, []);

    React.useEffect(() => {
        async function getCountComments() {
            const user = JSON.parse(localStorage.getItem('user'));

            try {
                const res = await fetch('http://localhost:3333/api/comments/count', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticketId: ticket[indexTicket].ticketId,
                        questionId: ticket[indexTicket].questionId,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw err;
                }
                const data = await res.json();
                setCounterComments(data);
            } catch (err) {
                Errors.setMessage(err.message);
            }
        }
        getCountComments();
    }, [ticket, indexTicket]);

    React.useEffect(() => {
        if (!userAnswers.includes(null) && ticket.length > 2) {
            //Переход на результат тестирования после ответа на все вопросы
            const correctAnswers = userAnswers.reduce((accum, num) => accum + num, 0);
            localStorage.setItem('readyTicket', JSON.stringify(ticket));
            localStorage.setItem('correctAnswers', correctAnswers);
            return navigate('/result');
        }
    }, [userAnswers, ticket, navigate]);

    return (
        <div className={`${s.wrapper} ${s[ModeStorage.theme]}`}>
            <div className={`${s.wrapperContent} ${s[ModeStorage.theme]}`}>
                <Header />
                <NavOfQuestion {...states} />
                <div className={s.wrapperTimer}>
                    {typeTest !== 'Экзамен' && <GoBack />}
                    <Timer {...states} />
                </div>

                <Question {...states} />
                <StepBtns {...states} />

                <div className={s.wrapperCountComments} onClick={() => setIsOpenComments(!isOpenComments)}>
                    <img src={iconComments} alt='comments' />
                    <p className={s.countComments}>Комментарии: {counterComments.count}</p>
                </div>
                {isOpenComments && (
                    <UserComments
                        ticketId={ticket[indexTicket].ticketId}
                        questionId={ticket[indexTicket].questionId}
                        setCounterComments={setCounterComments}
                    />
                )}
            </div>
        </div>
    );
}

export default observer(Testing);
