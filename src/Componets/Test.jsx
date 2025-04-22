import React from 'react';
import Header from './Header.jsx';
import NavOfQuestion from './NavOfQuestion.jsx';
import GoBack from './GoBack.jsx';
import Timer from './Timer.jsx';
import Question from './Question.jsx';
import StepBtns from './StepBtns.jsx';
import ModeStorage from '../store/ModeStorage.js';
import Comments from './Comments.jsx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import s from '../StyleComponets/test.module.css';

function Testing() {
    const typeTest = localStorage.getItem('typeTest');
    const [ticket, setTicket] = React.useState([{ question: '', answers: [], img: '', questionId: '' }]);
    const [indexTicket, setIndexTicket] = React.useState(0);
    const [userAnswers, setUserAnswers] = React.useState([0]);

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

        setTicket(localeStorageTicket);// основной массив вопросов, из выбраного билета или экзамен
        setUserAnswers(arr); //второстепенный массив для записи  0 или 1 после ответа на вопрос + опора при навигаций по вопросам
    }, []);

    React.useEffect(() => {
        if (!userAnswers.includes(null) && ticket.length > 2) { //Переход на результат тестирования после ответа на все вопросы
            const correctAnswers = userAnswers.reduce((accum, num) => accum + num, 0);
            localStorage.setItem('readyTicket', JSON.stringify(ticket));
            localStorage.setItem('correctAnswers', correctAnswers);
            return navigate('/result'); 
        }
    }, [userAnswers, ticket, navigate]); 

    return (
        <div className={`${s.divWrapper} ${s[ModeStorage.theme]}`}>
            <div className={`${s.divWrapperContent} ${s[ModeStorage.theme]}`}>
                <Header />
                <NavOfQuestion {...states} />
                <div className={s.test}>
                    {typeTest !== 'Экзамен' && <GoBack />}
                    <Timer {...states} />
                </div>

                <Question {...states} />
                <StepBtns {...states} />

                {typeTest === 'Экзамен' || typeTest === 'Тренировочный экзамен' ? '' : <Comments {...states} />}
            </div>
        </div>
    );
}

export default observer(Testing);
